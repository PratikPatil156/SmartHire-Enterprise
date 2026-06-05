import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def init_db():
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "Pratik@143")
    )
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {os.getenv('DB_NAME', 'smarthire_db')}")
    cursor.execute(f"USE {os.getenv('DB_NAME', 'smarthire_db')}")
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('candidate', 'hr') NOT NULL,
            company VARCHAR(100) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hr_id INT NOT NULL,
            title VARCHAR(100) NOT NULL,
            company VARCHAR(100) NOT NULL,
            description TEXT,
            requirements TEXT,
            location VARCHAR(100),
            posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (hr_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS resumes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            candidate_id INT UNIQUE,
            file_name VARCHAR(255) NOT NULL,
            extracted_text LONGTEXT,
            overall_score INT DEFAULT 0,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            candidate_id INT NOT NULL,
            job_id INT NOT NULL,
            status VARCHAR(50) DEFAULT 'Applied',
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            interview_date VARCHAR(100) DEFAULT NULL,
            interview_time VARCHAR(100) DEFAULT NULL,
            interview_meet_link VARCHAR(255) DEFAULT NULL,
            interview_code VARCHAR(50) DEFAULT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY candidate_job (candidate_id, job_id),
            FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS saved_jobs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            candidate_id INT NOT NULL,
            job_id INT NOT NULL,
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY candidate_job_saved (candidate_id, job_id),
            FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
        )
    """)
    
    # 6. Create activity_logs Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS activity_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_name VARCHAR(100) NOT NULL,
            action VARCHAR(100) NOT NULL,
            target VARCHAR(100) NOT NULL,
            role VARCHAR(100) NOT NULL,
            details TEXT,
            event_type VARCHAR(50) DEFAULT 'system',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # 7. Create recruitment_tags Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS recruitment_tags (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 8. Create user_profiles Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_profiles (
            user_id INT PRIMARY KEY,
            avatar_image LONGTEXT,
            phone VARCHAR(50),
            location VARCHAR(100),
            course_role VARCHAR(150),
            student_emp_id VARCHAR(50),
            about TEXT,
            skills TEXT,
            placement_ready VARCHAR(50),
            profile_status VARCHAR(50),
            profile_completed VARCHAR(50),
            backend_progress INT DEFAULT 0,
            frontend_progress INT DEFAULT 0,
            interview_progress INT DEFAULT 0,
            placement_insights_title VARCHAR(150),
            placement_insights_desc TEXT,
            achievements TEXT,
            github_link VARCHAR(255),
            linkedin_link VARCHAR(255),
            portfolio_link VARCHAR(255),
            certifications TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)
    
    # 9. Create application_tags Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS application_tags (
            application_id INT NOT NULL,
            tag_name VARCHAR(100) NOT NULL,
            PRIMARY KEY (application_id, tag_name),
            FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
        )
    """)
    
    conn.commit()

    # Seed Default Recruitment Tags if table is empty
    cursor.execute("SELECT COUNT(*) as count FROM recruitment_tags")
    res = cursor.fetchone()
    if not res or res[0] == 0:
        default_tags = ['Immediate Joiner', 'High Score', 'Under Review', 'Verified', 'Remote Only']
        for tag in default_tags:
            try:
                cursor.execute("INSERT IGNORE INTO recruitment_tags (name) VALUES (%s)", (tag,))
            except Exception:
                pass
        conn.commit()

    # Create skills_catalog Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS skills_catalog (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

    # Seed Default Skills if table is empty
    cursor.execute("SELECT COUNT(*) as count FROM skills_catalog")
    res_skills = cursor.fetchone()
    if not res_skills or res_skills[0] == 0:
        default_skills = [
            # Frontend
            "React", "React.js", "Vue", "Angular", "Svelte", "Next.js", "HTML", "CSS", "JavaScript", "TypeScript", 
            "Tailwind CSS", "Tailwind", "Bootstrap", "Redux", "Sass",
            # Backend
            "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "Java", "Go", "Golang", "Rust", 
            "Ruby", "Rails", "NestJS", "ASP.NET", "PHP",
            # Database
            "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "SQLite", "SQL", "MariaDB",
            # Cloud & DevOps
            "Docker", "AWS", "Kubernetes", "Terraform", "Ansible", "Jenkins", "CI/CD", "GitHub Actions", 
            "Linux", "Bash", "Nginx", "Apache", "GCP", "Azure",
            # Data Science, ML & AI
            "Python", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "TensorFlow", "PyTorch", 
            "Keras", "Machine Learning", "Deep Learning", "OpenCV", "NLP", "Data Analysis", "LangChain", 
            "RAG", "LLM", "OpenAI", "LlamaIndex", "Hugging Face", "Prompt Engineering", "Vector Databases",
            # Core Tech & Computer Science
            "Git", "GitHub", "System Design", "REST API", "Data Structures", "Algorithms"
        ]
        for skill in default_skills:
            try:
                cursor.execute("INSERT IGNORE INTO skills_catalog (name) VALUES (%s)", (skill.strip(),))
            except Exception:
                pass
        conn.commit()

    # Active Clean up: Ensure VS Code, IntelliJ, Eclipse, Unix, Oracle, Postman, Jira, Figma, Jupyter are deleted from database
    try:
        unwanted_tools = ['VS Code', 'VSCode', 'IntelliJ', 'IntelliJ IDEA', 'Eclipse', 'Oracle', 'UNIX', 'Unix', 'Postman', 'Jira', 'Figma', 'Jupyter']
        format_strings = ','.join(['%s'] * len(unwanted_tools))
        cursor.execute(f"DELETE FROM skills_catalog WHERE name IN ({format_strings})", unwanted_tools)
        conn.commit()
    except Exception as e:
        print(f"Error cleaning unwanted tools from skills_catalog: {e}")

    cursor.close()
    conn.close()

def log_activity(db, user_name: str, action: str, target: str, role: str, details: str, event_type: str = 'system'):
    try:
        conn, cursor = db
        query = "INSERT INTO activity_logs (user_name, action, target, role, details, event_type) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (user_name, action, target, role, details, event_type))
        conn.commit()
    except Exception as e:
        print(f"Error logging activity: {e}")


def get_db():
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "Pratik@143"),
        database=os.getenv("DB_NAME", "smarthire_db")
    )
    cursor = conn.cursor(dictionary=True)
    try:
        yield conn, cursor
    finally:
        cursor.close()
        conn.close()
