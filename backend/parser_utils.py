import re

# Extensive catalog of industry-standard tools and technologies
KNOWN_SKILLS = [
    # Frontend
    "React", "Vue", "Angular", "Svelte", "Next.js", "HTML", "CSS", "JavaScript", "TypeScript", "Tailwind CSS", "Bootstrap", "Redux", "Sass",
    # Backend
    "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "Java", "Go", "Golang", "Rust", "Ruby", "Rails", "NestJS", "ASP.NET", "PHP",
    # Database
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "SQLite", "SQL", "MariaDB",
    # Cloud & DevOps
    "Docker", "AWS", "Kubernetes", "Terraform", "Ansible", "Jenkins", "CI/CD", "GitHub Actions", "Linux", "Bash", "Nginx", "Apache", "GCP", "Azure",
    # Data Science, ML & AI
    "Python", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "TensorFlow", "PyTorch", "Keras", "Machine Learning", "Deep Learning", "OpenCV", "NLP", "Data Analysis",
    "LangChain", "RAG", "LLM", "OpenAI", "LlamaIndex", "Hugging Face", "Prompt Engineering", "Vector Databases",
    # Core Tech & Computer Science
    "Git", "GitHub", "System Design", "REST API", "Data Structures", "Algorithms"
]

def normalize_text(text: str) -> str:
    """Cleans and normalizes text for reliable matching."""
    if not text:
        return ""
    # Lowercase and replace double/multiple spaces with single space
    cleaned = text.lower().strip()
    cleaned = re.sub(r'\s+', ' ', cleaned)
    return cleaned

def detect_career_level(text: str) -> str:
    """
    Intelligently detects whether a candidate is a Fresher, an Intern, or Experienced.
    """
    normalized = normalize_text(text)
    if not normalized or len(normalized.split()) < 10:
        return "Fresher"

    # Define linguistic indicators for each category
    experienced_keywords = [
        r"\b(?:senior|lead|architect|manager|head|principal|sr\.|executive)\b",
        r"\b\d+\+\s*years?\s+(?:of\s+)?experience\b",
        r"\bexperience\s+(?:of\s+)?\d+\+\s*years?\b",
        r"\b(?:managed|led|orchestrated|spearheaded|supervised|team\s+lead)\b"
    ]
    
    intern_keywords = [
        r"\b(?:intern|internship|trainee|apprentice|co-op)\b"
    ]
    
    fresher_keywords = [
        r"\b(?:fresher|student|undergraduate|graduate|entry\s*level|no\s+experience|seeking\s+(?:an\s+)?entry)\b",
        r"\b(?:academic\s+projects|pursuing|curriculum|b\.tech|b\.e\.|m\.tech|bca|mca)\b"
    ]
    
    exp_matches = sum(1 for pattern in experienced_keywords if re.search(pattern, normalized))
    intern_matches = sum(1 for pattern in intern_keywords if re.search(pattern, normalized))
    fresher_matches = sum(1 for pattern in fresher_keywords if re.search(pattern, normalized))
    
    # Check for date ranges indicating multi-year tenure (e.g. 2020 - 2024, 2021-present)
    date_ranges = re.findall(r'\b(20\d{2})\b\s*[-–—to]+\s*\b(20\d{2}|present|current)\b', normalized)
    
    # If date ranges span more than 2 years or multiple experiences are found
    has_multi_year = False
    if date_ranges:
        total_span = 0
        for start, end in date_ranges:
            s_year = int(start)
            e_year = 2026 if end in ['present', 'current'] else int(end)
            total_span += max(0, e_year - s_year)
        if total_span >= 2:
            has_multi_year = True

    # Classification logic
    if exp_matches >= 2 or (exp_matches >= 1 and has_multi_year):
        return "Experienced"
    elif intern_matches >= 1 and exp_matches < 2:
        return "Intern"
    else:
        # Default or stronger fresher match
        return "Fresher"

def parse_sections(text: str) -> dict:
    """Detects presence of standard resume sections."""
    normalized = normalize_text(text)
    
    sections = {
        "experience": False,
        "education": False,
        "skills": False,
        "projects": False,
        "contact": False
    }
    
    if not normalized:
        return sections
        
    # Search patterns
    if re.search(r'\b(?:experience|employment|work history|professional background|career history)\b', normalized):
        sections["experience"] = True
    if re.search(r'\b(?:education|academic|university|college|degree|qualification)\b', normalized):
        sections["education"] = True
    if re.search(r'\b(?:skills|technical skills|technologies|tools|competencies|expertise)\b', normalized):
        sections["skills"] = True
    if re.search(r'\b(?:projects|academic projects|personal projects|key projects)\b', normalized):
        sections["projects"] = True
    if re.search(r'\b(?:contact|email|phone|address|linkedin|github|@)\b', normalized):
        sections["contact"] = True
        
    return sections

def get_all_skills(cursor=None) -> list:
    """Fetches all skills from skills_catalog if cursor is provided, else falls back to KNOWN_SKILLS."""
    if cursor:
        try:
            cursor.execute("SELECT name FROM skills_catalog ORDER BY CHAR_LENGTH(name) DESC, name ASC")
            rows = cursor.fetchall()
            if rows:
                skills = []
                for row in rows:
                    if isinstance(row, dict):
                        skills.append(row["name"])
                    elif isinstance(row, (tuple, list)):
                        skills.append(row[0])
                if skills:
                    return skills
        except Exception as e:
            print(f"Error fetching skills from skills_catalog: {e}")
    return KNOWN_SKILLS

def register_skills_in_catalog(db, skills_str: str):
    """Parses a comma-separated string of skills and registers any new ones in the database."""
    if not skills_str or not db:
        return
    try:
        conn, cursor = db
        skills = [s.strip() for s in skills_str.split(',') if s.strip()]
        for skill in skills:
            cursor.execute("INSERT IGNORE INTO skills_catalog (name) VALUES (%s)", (skill,))
        conn.commit()
    except Exception as e:
        print(f"Error registering skills in catalog: {e}")

def extract_skills(text: str, cursor=None) -> list:
    """Robustly extracts modern skills from the resume text using exact boundaries."""
    normalized = normalize_text(text)
    if not normalized:
        return []
        
    skills_to_check = get_all_skills(cursor)
    matched = []
    for skill in skills_to_check:
        # Custom word boundaries to handle symbols like .js, #, ++, etc.
        pattern = rf"(?:^|[^a-zA-Z0-9]){re.escape(skill.lower())}(?:[^a-zA-Z0-9]|$)"
        if re.search(pattern, normalized):
            matched.append(skill)
            
    return matched

def calculate_ats_score(text: str, req_skills: list) -> int:
    """
    Computes an ATS compliance score (out of 100) based on the user's exact weight requests:
    1. Skills Matching (25% weight)
    2. Experience (20% weight)
    3. Projects (15% weight)
    4. ATS Compatibility (20% weight)
    5. Formatting (10% weight)
    6. Grammar & Tone (5% weight)
    7. Certifications (5% weight)
    
    Includes a relevance gate: if the candidate matches 0 required skills for a highly technical role,
    a penalty is applied to keep the match score extremely realistic (e.g. ~20% instead of >50%).
    """
    normalized = normalize_text(text)
    words = normalized.split()
    
    # 1. Scanned/Empty PDF check
    if not normalized or len(words) < 15:
        return 0

    # A. Skills Matching (Max 25)
    skills_score = 0
    matched_reqs = 0
    if req_skills:
        req_lower = [r.strip().lower() for r in req_skills]
        for req in req_lower:
            pattern = rf"(?:^|[^a-zA-Z0-9]){re.escape(req)}(?:[^a-zA-Z0-9]|$)"
            if re.search(pattern, normalized):
                matched_reqs += 1
        skills_score = int((matched_reqs / len(req_lower)) * 25)
    else:
        skills_score = 25

    # B. Experience (Max 20)
    level = detect_career_level(text)
    sections = parse_sections(text)
    
    experience_points = 0
    if level == "Experienced":
        experience_points += 15
    elif level == "Intern":
        experience_points += 10
    else: # Fresher
        experience_points += 5
        
    if sections["experience"]:
        experience_points += 5
        
    experience_score = min(20, experience_points)

    # C. Projects (Max 15)
    project_points = 0
    if sections["projects"]:
        project_points += 10
    # Search for github links or git version control references in resume
    if 'github' in normalized or 'git' in normalized:
        project_points += 5
    project_score = min(15, project_points)

    # D. ATS Compatibility (Max 20)
    # Evaluated based on how many standard sections are found
    detected_sections = sum(1 for val in sections.values() if val)
    if detected_sections >= 4:
        ats_score = 20
    elif detected_sections == 3:
        ats_score = 12
    elif detected_sections == 2:
        ats_score = 6
    else:
        ats_score = 3

    # E. Formatting (Max 10)
    formatting_points = 0
    has_email = '@' in normalized
    has_phone = re.search(r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|\b\d{10}\b', normalized) is not None
    if has_email:
        formatting_points += 3
    if has_phone:
        formatting_points += 3
    if 100 <= len(words) <= 1200:
        formatting_points += 4
    elif len(words) > 0:
        formatting_points += 2
    formatting_score = min(10, formatting_points)

    # F. Grammar & Professional Tone Heuristics (Max 5)
    grammar_points = 5
    # Deduct points if we see obvious OCR spacing errors like "sealabi lity" or messy consecutive empty lines
    if 'lity' in normalized or 'cl/cd' in normalized or '\n \n \n \n \n' in text:
        grammar_points -= 2
    grammar_score = max(1, grammar_points)

    # G. Certifications & Achievements (Max 5)
    has_certifications = re.search(r'\b(?:certification|certified|certifications|award|achievement|achievements|course|courses)\b', normalized) is not None
    certifications_score = 5 if has_certifications else 2

    # Combined base score calculation
    base_score = skills_score + experience_score + project_score + ats_score + formatting_score + grammar_score + certifications_score
    
    # Apply Relevance Gate Penalty:
    # If the job has required skills but the candidate has 0 match, we scale the score down
    # because a candidate with absolutely zero domain overlap should not show a high match percentage.
    if req_skills and matched_reqs == 0:
        base_score = int(base_score * 0.35) # Capping score to approx ~15%-25% range
        
    return max(0, min(100, base_score))

def generate_analysis_report(text: str, req_skills: list) -> dict:
    """Generates an extensive candidate resume analysis report."""
    normalized = normalize_text(text)
    words = normalized.split()
    
    # Empty / Scanned check
    if not normalized or len(words) < 15:
        return {
            "has_resume": True,
            "score": 0,
            "status": "Action Required",
            "missingKeywords": req_skills if req_skills else [],
            "suggestions": [
                "WARNING: Your uploaded PDF seems to be an image-only (scanned) document. The AI could not extract any text.",
                "Please download/export your resume as a standard text-based PDF (e.g. standard PDF in Canva or Word) so ATS scanners can parse your skills.",
                "Verify if you can select and highlight text with your mouse inside your PDF file. If not, it is an image PDF."
            ],
            "atsCompatibility": "Low"
        }
        
    score = calculate_ats_score(text, req_skills)
    level = detect_career_level(text)
    sections = parse_sections(text)
    extracted = extract_skills(text)
    
    # 1. Missing keywords check
    missing = []
    if req_skills:
        req_lower = [r.strip().lower() for r in req_skills]
        for req in req_skills:
            pattern = rf"(?:^|[^a-zA-Z0-9]){re.escape(req.lower())}(?:[^a-zA-Z0-9]|$)"
            if not re.search(pattern, normalized):
                missing.append(req)
                
    # 2. Dynamic Career-level & Content-based Suggestions
    suggestions = []
    
    # A. Missing sections
    missing_sections = [sect for sect, present in sections.items() if not present]
    if missing_sections:
        suggestions.append(f"Add missing core sections: {', '.join([s.capitalize() for s in missing_sections])}.")
        
    # B. Career-level tailored suggestions
    if level == "Fresher":
        suggestions.append("Highlight academic coursework (Data Structures, Algorithms, Databases) and projects.")
        suggestions.append("Include links to your GitHub repositories or live web demos to prove hands-on capability.")
        suggestions.append("Focus your resume profile on eagerness to learn, relevant college achievements, and tech stack foundation.")
    elif level == "Intern":
        suggestions.append("Expand on specific tasks, learning, and contributions accomplished during your internships.")
        suggestions.append("Add school or personal projects that reflect modern practices like REST APIs, Docker, or Cloud hosting.")
    else: # Experienced
        suggestions.append("Lead bullet points with senior action verbs like 'Spearheaded', 'Orchestrated', 'Designed', or 'Architected'.")
        # Metric advice
        has_metrics = re.search(r'\b\d+(?:\.\d+)?%\b|\b\$\d+(?:,\d+)?\b|\b\d+x\b|\b\d+\s*(?:k|m|million|billion)\b', normalized) is not None
        if not has_metrics:
            suggestions.append("Add quantifiable impact metrics to your experience bullets (e.g. 'Optimized latency by 35%' or 'Led team of 4 developers').")
        suggestions.append("Ensure your system design and leadership capabilities are highlighted rather than just basic coding.")

    # C. General structural checks
    if '@' not in normalized:
        suggestions.append("Ensure your contact email is clearly visible at the top of your resume.")
    if 'linkedin' not in normalized:
        suggestions.append("Add a link to your updated LinkedIn profile to increase recruiter response rate.")
    if 'git' not in normalized and 'github' not in normalized:
        suggestions.append("Mention version control tools like Git and GitHub in your tools catalog.")

    # Cap suggestions to maximum of 5 to keep UI clean and actionable
    suggestions = suggestions[:5]
    
    # Status labeling
    if score >= 70:
        status = "Good"
        ats = "High"
    elif score >= 45:
        status = "Average"
        ats = "Medium"
    else:
        status = "Action Required"
        ats = "Low"
        
    return {
        "has_resume": True,
        "score": score,
        "status": status,
        "missingKeywords": missing,
        "suggestions": suggestions,
        "atsCompatibility": ats,
        "career_level": level,
        "extracted_skills": extracted
    }

