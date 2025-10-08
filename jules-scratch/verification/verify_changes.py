import os
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Get the absolute path to the HTML files
    base_path = os.path.abspath('.')

    # Verify contact-us.html
    contact_us_path = f"file://{os.path.join(base_path, 'contact-us.html')}"
    page.goto(contact_us_path)

    # Check for the Formspree form
    form = page.locator('form[action="https://formspree.io/f/xkgqzdlk"]')
    expect(form).to_be_visible()

    # Check for the email input
    email_input = page.locator('input[name="email"]')
    expect(email_input).to_be_visible()

    # Check for the message textarea
    message_textarea = page.locator('textarea[name="message"]')
    expect(message_textarea).to_be_visible()

    # Take a screenshot of the contact form
    page.screenshot(path="jules-scratch/verification/contact-us.png")

    # Verify index.html
    index_path = f"file://{os.path.join(base_path, 'index.html')}"
    page.goto(index_path)

    # Check for lazy-loaded images
    lazy_image = page.locator('img[loading="lazy"]').first
    expect(lazy_image).to_be_visible()

    # Take a screenshot of the index page
    page.screenshot(path="jules-scratch/verification/index.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)