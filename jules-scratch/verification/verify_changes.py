from playwright.sync_api import sync_playwright, expect
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Get the absolute path to the index.html file
    file_path = os.path.abspath('index.html')

    # Go to the local index.html file
    page.goto(f'file://{file_path}')
    page.set_viewport_size({"width": 1280, "height": 800})

    # 1. Screenshot of the Hero Section
    hero_heading = page.locator("h1", has_text="Empowering Your Digital Future")
    expect(hero_heading).to_be_visible()
    page.wait_for_timeout(1000) # Wait for animations
    page.screenshot(path='jules-scratch/verification/01_hero_section.png')

    # 2. Scroll to and screenshot the Team Section with hover effect
    team_section = page.locator("section:has-text('Meet Our Dedicated Team')")
    team_section.scroll_into_view_if_needed()
    page.wait_for_timeout(1000) # wait for scroll and animations

    # Hover over the first team member
    first_team_member = team_section.locator('.animate_top.rj').first
    expect(first_team_member).to_be_visible()
    first_team_member.hover()

    # Wait for the hover content to be visible
    hover_content = first_team_member.locator('.team-item-hover-content')
    expect(hover_content).to_be_visible()

    page.screenshot(path='jules-scratch/verification/02_team_section_hover.png')

    # 3. Scroll to and screenshot the Blog Section after filtering
    blog_section_title = page.get_by_text("Latest Blogs & News")
    blog_section_title.scroll_into_view_if_needed()

    # Type into search bar
    search_input = page.locator('#blog-search')
    search_input.fill('cyber')
    page.wait_for_timeout(500) # wait for filtering to apply
    page.screenshot(path='jules-scratch/verification/03_blog_section_filtered.png')

    # Click a filter button
    career_filter = page.get_by_role('button', name="Career")
    career_filter.click()
    page.wait_for_timeout(500) # wait for filtering to apply

    page.screenshot(path='jules-scratch/verification/04_blog_section_category.png')


    browser.close()

with sync_playwright() as playwright:
    run(playwright)