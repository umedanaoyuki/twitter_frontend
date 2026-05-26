import { test, expect } from "@playwright/test";

const FRONTEND_URL =
  process.env.E2E_FRONTEND_URL ?? "http://localhost:3000";
const MAILCATCHER_URL =
  process.env.E2E_MAILCATCHER_URL ?? "http://localhost:1080";
const TEST_PASSWORD = "Password1!";

test.describe("アカウント登録とメール認証", () => {
  test("新規登録からメール認証によるアカウント有効化まで", async ({
    page,
    context,
  }) => {
    const email = `playwright-test-${Date.now()}@example.com`;

    // （1）トップページへ移動
    await page.goto(FRONTEND_URL);

    // （2）「アカウントを作成」を押下
    await page.getByRole("link", { name: "アカウントを作成" }).click();
    await expect(page).toHaveURL(`${FRONTEND_URL}/signup`);

    // （3）モーダルで新規アカウントを作成
    const dialog = page.getByRole("dialog", { name: "アカウントを作成" });
    await expect(dialog).toBeVisible();

    await dialog.getByPlaceholder("メールアドレス").fill(email);
    await dialog
      .getByPlaceholder("パスワード(例: Password1!)")
      .fill(TEST_PASSWORD);
    await dialog.getByRole("button", { name: "登録する" }).click();

    // （4）登録成功のトースト（メール認証が必要）
    await expect(
      page.getByText(/メールを送信しました/),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByText(/アカウントを有効化してください/),
    ).toBeVisible();

    // （5）MailCatcher へ移動
    const mailPage = await context.newPage();
    await mailPage.goto(MAILCATCHER_URL);

    // （6）登録メールアドレス宛のメールが届いていることを確認
    const mailRow = mailPage.getByRole("row", {
      name: new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    });
    await expect(mailRow).toBeVisible({ timeout: 15_000 });
    await mailRow.click();

    await expect(mailPage.getByText(email)).toBeVisible();

    // （7）「アカウントを有効化」リンクを押下し、JSON レスポンスを確認
    const activateLink = mailPage
      .frameLocator("iframe")
      .getByRole("link", { name: "アカウントを有効化" });

    await expect(activateLink).toBeVisible();

    const [activatePage] = await Promise.all([
      context.waitForEvent("page"),
      activateLink.click(),
    ]);
    await activatePage.waitForLoadState();

    const bodyText = await activatePage.locator("body").innerText();
    expect(JSON.parse(bodyText)).toEqual({
      message: "アカウントが有効化されました",
    });

    await activatePage.close();
    await mailPage.close();
  });
});
