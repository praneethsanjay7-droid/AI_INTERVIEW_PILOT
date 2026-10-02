const { Builder, By } = require("selenium-webdriver");

jest.setTimeout(30000);

describe("InterviewPilot Selenium UI Tests", () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder()
            .forBrowser("chrome")
            .build();
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    test("InterviewPilot home page should load successfully", async () => {
        await driver.get("http://localhost:5001");

        const title = await driver.getTitle();
        expect(title).toContain("InterviewPilot");

        const body = await driver.findElement(By.tagName("body"));
        const bodyText = await body.getText();

        expect(bodyText).toContain("InterviewPilot");
    });

    test("Registration page should contain the registration form", async () => {
        await driver.get("http://localhost:5001/register");

        const nameInput = await driver.findElement(By.id("name"));
        const emailInput = await driver.findElement(By.id("email"));
        const passwordInput = await driver.findElement(By.id("password"));
        const roleSelect = await driver.findElement(By.id("role"));

        expect(await nameInput.isDisplayed()).toBe(true);
        expect(await emailInput.isDisplayed()).toBe(true);
        expect(await passwordInput.isDisplayed()).toBe(true);
        expect(await roleSelect.isDisplayed()).toBe(true);
    });
});