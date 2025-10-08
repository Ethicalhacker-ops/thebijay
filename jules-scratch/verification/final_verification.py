import os
import glob
from playwright.sync_api import sync_playwright, expect

def run_final_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        html_files = glob.glob("**/*.html", recursive=True)

        all_passed = True

        for html_file in html_files:
            if "jules-scratch" in html_file:
                continue

            print(f"\n--- Verifying {html_file} ---")

            console_errors = []
            page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)

            page.goto(f"file:///app/{html_file}")

            # Check for broken links
            links = page.locator("a").evaluate_all("elements => elements.map(a => ({ href: a.href, target: a.target }))")
            for link_info in links:
                href = link_info['href']
                target = link_info['target']

                if not href or href.startswith("mailto:") or href.startswith("tel:"):
                    continue

                if href.endswith("#!"):
                    print(f"FAILED: Found 'href=\"#!\"' in {html_file}")
                    all_passed = False
                    continue

                if href.startswith("http"):
                    if target != "_blank":
                        print(f"WARNING: External link missing target='_blank': {href} in {html_file}")
                elif href.startswith("file://"):
                    filepath = href.replace("file:///app/", "")
                    if "#" not in filepath and not os.path.exists(filepath):
                        print(f"FAILED: Broken internal link {href} in {html_file}")
                        all_passed = False

            # Check script tags
            scripts = page.locator("script").evaluate_all("elements => elements.map(s => s.src)")
            for script in scripts:
                if "bundle.js" in script or "js/main.js" in script:
                    print(f"FAILED: Found incorrect script tag: {script} in {html_file}")
                    all_passed = False

            if console_errors:
                print(f"CONSOLE ERRORS in {html_file}:")
                for error in console_errors:
                    print(f"  - {error}")
                all_passed = False

            console_errors.clear()

        if all_passed:
            print("\n✅ Final verification successful. All checks passed.")
        else:
            print("\n❌ Final verification failed. Please review the errors above.")

        browser.close()

if __name__ == "__main__":
    run_final_verification()