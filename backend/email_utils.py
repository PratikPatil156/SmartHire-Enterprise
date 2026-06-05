import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

def send_interview_email(app_id: int, candidate_name: str, candidate_email: str, job_title: str, interview_date: str, interview_time: str, meet_link: str, interview_code: str = "N/A"):
    
    # HTML Content with premium and professional styling
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Interview Invitation - SmartHire</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f8fafc;
                margin: 0;
                padding: 0;
                color: #334155;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 24px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: #ffffff;
                padding: 40px 30px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
                font-weight: 800;
                letter-spacing: -0.025em;
            }}
            .header p {{
                margin: 8px 0 0;
                font-size: 14px;
                opacity: 0.9;
                font-weight: 500;
            }}
            .body {{
                padding: 40px 30px;
            }}
            .greeting {{
                font-size: 18px;
                font-weight: 700;
                color: #0f172a;
                margin-bottom: 16px;
            }}
            .intro {{
                font-size: 14px;
                line-height: 1.6;
                color: #475569;
                margin-bottom: 30px;
            }}
            .details-card {{
                background-color: #f8fafc;
                border: 1px solid #f1f5f9;
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 30px;
            }}
            .details-row {{
                display: flex;
                margin-bottom: 12px;
                font-size: 14px;
            }}
            .details-row:last-child {{
                margin-bottom: 0;
            }}
            .details-label {{
                font-weight: 700;
                color: #64748b;
                width: 120px;
                text-transform: uppercase;
                font-size: 11px;
                letter-spacing: 0.05em;
            }}
            .details-value {{
                color: #0f172a;
                font-weight: 600;
            }}
            .code-value {{
                font-family: monospace;
                background-color: #e2e8f0;
                padding: 2px 6px;
                border-radius: 6px;
                font-size: 13px;
                color: #0f172a;
                font-weight: bold;
            }}
            .btn-container {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .btn {{
                display: inline-block;
                background-color: #2563eb;
                color: #ffffff !important;
                text-decoration: none;
                padding: 14px 30px;
                font-weight: 700;
                font-size: 14px;
                border-radius: 14px;
                box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
                transition: all 0.2s ease;
            }}
            .footer {{
                background-color: #f8fafc;
                padding: 24px 30px;
                text-align: center;
                font-size: 11px;
                color: #94a3b8;
                border-top: 1px solid #f1f5f9;
            }}
            .footer p {{
                margin: 4px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>SmartHire</h1>
                <p>Interview Invitation / साक्षात्कार निमंत्रण</p>
            </div>
            
            <div class="body">
                <div class="greeting">Hi {candidate_name},</div>
                <div class="intro">
                    Congratulations! You have been shortlisted for the **{job_title}** position. 
                    We are excited to discuss this opportunity with you. Your interview has been scheduled with our hiring team.
                </div>
                
                <div class="details-card">
                    <div class="details-row">
                        <div class="details-label">Position:</div>
                        <div class="details-value">{job_title}</div>
                    </div>
                    <div class="details-row">
                        <div class="details-label">Date:</div>
                        <div class="details-value">{interview_date}</div>
                    </div>
                    <div class="details-row">
                        <div class="details-label">Time:</div>
                        <div class="details-value">{interview_time}</div>
                    </div>
                    <div class="details-row">
                        <div class="details-label">Access Passcode:</div>
                        <div class="details-value"><span class="code-value">{interview_code}</span></div>
                    </div>
                </div>
                
                <div class="btn-container">
                    <a href="{meet_link}" class="btn" target="_blank">Join Interview Call</a>
                </div>
                
                <div class="intro" style="font-size: 12px; margin-top: 20px; color: #64748b;">
                    <strong>Instructions:</strong> Please ensure your camera and microphone are working properly before the call. Click the button above at the scheduled time to enter the virtual meeting room.
                </div>
            </div>
            
            <div class="footer">
                <p>Sent automatically by SmartHire Recruitment Platform.</p>
                <p>&copy; 2026 SmartHire. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    # Check if SMTP details are configured
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    
    if smtp_host and smtp_port and smtp_user and smtp_password:
        try:
            # Send real email
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"Interview Invitation: {job_title} - SmartHire"
            msg["From"] = smtp_user
            msg["To"] = candidate_email
            
            msg.attach(MIMEText(html_content, "html"))
            
            server = smtplib.SMTP(smtp_host, int(smtp_port))
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, candidate_email, msg.as_string())
            server.quit()
            
            print(f"[SMTP] Successfully sent interview invitation email to {candidate_email}")
            return True
        except Exception as e:
            print(f"[SMTP ERROR] Failed to send email via SMTP: {e}")
            
    # Fallback: Simulate sending and write to local directory
    try:
        sent_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sent_emails")
        os.makedirs(sent_dir, exist_ok=True)
        file_path = os.path.join(sent_dir, f"interview_{app_id}.html")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        print(f"[SIMULATED EMAIL] Written interview notification to: {file_path}")
        print(f"[EMAIL TO CANDIDATE] To: {candidate_email} | Subject: Interview Invitation: {job_title} | Link: {meet_link} | Passcode: {interview_code}")
        return True
    except Exception as e:
        print(f"[SIMULATION ERROR] Failed to write mock email file: {e}")
        return False
