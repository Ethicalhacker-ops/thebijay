from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local contact-us.html file
        page.goto("file:///app/contact-us.html")

        # Check for the Formspree form and that it doesn't have method="POST"
        formspree_form = page.locator('form[action="https://formspree.io/f/xkgqzdlk"]')
        expect(formspree_form).to_be_visible()
        expect(formspree_form).not_to_have_attribute("method", "POST")

        # Check for the reCAPTCHA widget
        recaptcha_widget = page.locator('.g-recaptcha')
        expect(recaptcha_widget).to_be_visible()

        # Check for the form fields
        expect(page.locator('label[for="email"]')).to_have_text("Your Email:")
        expect(page.locator('label[for="message"]')).to_have_text("Your Message:")

        # Scroll the form into view
        formspree_form.scroll_into_view_if_needed()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()