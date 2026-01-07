import os
import re
import urllib.parse
import datetime
import subprocess
from jsmin import jsmin

def get_github_url():
    """Tries to get the GitHub repository URL from local git config."""
    try:
        url = subprocess.check_output(["git", "config", "--get", "remote.origin.url"], 
                                      text=True).strip()
        if url.endswith(".git"):
            url = url[:-4]
        if url.startswith("git@github.com:"):
            url = url.replace("git@github.com:", "https://github.com/")
        return url
    except:
        # Fallback if git is not installed or not a repo
        return "https://github.com/"

def build():
    # Configuration
    src_dir = "src"
    dist_dir = "dist"
    # New target directory for public files
    public_dir = "docs"
    output_md = os.path.join(public_dir, "BOOKMARKLETS.md")
    output_html = os.path.join(public_dir, "index.html")
    repo_url = get_github_url()
    
    # Ensure directories exist
    for directory in [dist_dir, public_dir]:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"Created directory: {directory}")

    print(f"Starting Build Process for Repo: {repo_url}")

    bookmarklets_md = []
    html_cards = ""

    if not os.path.exists(src_dir):
        print(f"Error: Source directory '{src_dir}' not found!")
        return

    for filename in sorted(os.listdir(src_dir)):
        if filename.endswith(".js"):
            src_path = os.path.join(src_dir, filename)
            dist_path = os.path.join(dist_dir, filename.replace(".js", ".min.js"))
            
            print(f"Processing {filename}...")

            try:
                with open(src_path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                
                description = "No description available."
                if lines and lines[0].startswith("// Description:"):
                    description = lines[0].replace("// Description:", "").strip()
                    code_to_minify = "".join(lines[1:])
                else:
                    code_to_minify = "".join(lines)
                
                minified_code = jsmin(code_to_minify).strip()
                
                with open(dist_path, "w", encoding="utf-8") as f:
                    f.write("javascript:" + minified_code)
                
                safe_code = "javascript:" + urllib.parse.quote(minified_code, safe='()=;:,/')
                display_name = filename.replace(".js", "").replace("-", " ").title()
                
                # Markdown Entry
                bookmarklets_md.append(f"### {display_name}\n*{description}*\n\n👉 [Install {display_name}]({safe_code})\n")
                
                # HTML Card Entry
                html_cards += f"""
                <div class="card">
                    <h3>{display_name}</h3>
                    <p>{description}</p>
                    <a class="btn" href="{safe_code}" title="Drag this to your bookmarks bar">Install {display_name}</a>
                </div>"""

            except Exception as e:
                print(f"   Error: {e}")

    # Generate Output Files
    if bookmarklets_md:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 1. Update BOOKMARKLETS.md
        with open(output_md, "w", encoding="utf-8") as f:
            f.write(f"# Available Bookmarklets\n\nSource Code: [{repo_url}]({repo_url})\n\n---\n\n")
            f.write("\n---\n".join(bookmarklets_md))
        
        # 2. Update index.html
        html_template = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bookmarklet Directory</title>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; background: #f6f8fa; color: #24292f; }}
                header {{ display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d0d7de; padding-bottom: 10px; margin-bottom: 20px; }}
                h1 {{ margin: 0; font-size: 24px; }}
                .repo-link {{ text-decoration: none; color: #0969da; font-weight: 600; font-size: 14px; border: 1px solid #d0d7de; padding: 5px 12px; border-radius: 6px; background: white; }}
                .repo-link:hover {{ background: #f3f4f6; }}
                .card {{ background: white; padding: 20px; border: 1px solid #d0d7de; border-radius: 6px; margin-bottom: 16px; }}
                .card:hover {{ border-color: #0969da; box-shadow: 0 3px 10px rgba(0,0,0,0.05); }}
                h3 {{ margin-top: 0; color: #0969da; }}
                p {{ color: #57606a; font-style: italic; }}
                .btn {{ display: inline-block; padding: 8px 16px; background: #2da44e; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: move; }}
                .btn:hover {{ background: #2c974b; }}
                footer {{ margin-top: 40px; font-size: 12px; color: #6e7781; text-align: center; border-top: 1px solid #d0d7de; padding-top: 20px; }}
            </style>
        </head>
        <body>
            <header>
                <h1>Bookmarklet Directory</h1>
                <a class="repo-link" href="{repo_url}" target="_blank">View on GitHub</a>
            </header>
            <p>Drag the green buttons below to your bookmarks bar. These tools run locally in your browser.</p>
            {html_cards}
            <footer>
                Built with ❤️ for productivity | <a href="{repo_url}" style="color: #6e7781;">Source Code</a><br>
                Last updated: {timestamp}
            </footer>
        </body>
        </html>
        """
        with open(output_html, "w", encoding="utf-8") as f:
            f.write(html_template)
        
        print(f"\nBuild successful. Repo link set to: {repo_url}")

if __name__ == "__main__":
    build()