let canvasWidth;
let canvasHeight;

let marginX;
let marginY;

// Buttons and inputs
let resetButton;

let addLiquidityButton;
let addLiquidityInput;
let addLiquidityInputValue = 0;

let removeLiquidityButton;
let removeLiquidityInput;
let removeLiquidityInputValue = 0;

let depositButton;
let depositInput;
let depositInputValue = 0;

let releaseButton;
let releaseInput;
let releaseInputValue = 0;

// Liquidity pool dimensions
let liquidityPoolWidth;
let liquidityPoolHeight;
const roundFactor = 10;

let liquidityPoolX;
let liquidityPoolY;
let unscaledEquilibriumLiquidity;
let unscaledLiquidityPoolBalance;
let unscaledIncentivePoolBalance;
let equilibriumLiquidity = 50;
let liquidityPoolBalance = 50;

// Incentive pool
let incentivePoolWidth;
let incentivePoolHeight;

let incentivePoolX;
let incentivePoolY;

let incentivePoolBalance;
let incentivePoolReward;

// Sliders
let maxPunishmentSlider;
let equilibriumLiquiditySlider;
let poolLiquiditySlider;
let incentivePoolLiquiditySlider;

let sliderY;
let sliderX;

function setup() {
  canvasWidth = displayWidth;
  canvasHeight = displayHeight;

  marginX = canvasWidth / 6;
  marginY = canvasHeight / 6;

  liquidityPoolWidth = canvasWidth / 15;
  liquidityPoolHeight = canvasHeight / 7;

  incentivePoolWidth = canvasWidth / 30;
  incentivePoolHeight = canvasHeight / 14;

  unscaledEquilibriumLiquidity = liquidityPoolHeight / 2;
  unscaledLiquidityPoolBalance = unscaledEquilibriumLiquidity;
  unscaledIncentivePoolBalance = 0;
  incentivePoolBalance = 0;
  incentivePoolReward = 0;

  liquidityPoolX = canvasWidth / 2 - 3 * liquidityPoolWidth - marginX;
  liquidityPoolY = canvasHeight / 2 - liquidityPoolHeight - marginY;

  incentivePoolX =
    canvasWidth / 2 - 3 * incentivePoolWidth - marginX + incentivePoolWidth * 4;
  incentivePoolY = canvasHeight / 2 - incentivePoolHeight - marginY;

  sliderY = liquidityPoolY + liquidityPoolHeight * 1.75;
  sliderX = liquidityPoolX;

  createCanvas(canvasWidth, canvasHeight);

  addLiquidityButton = drawButton(
    "addLiquidityERC20",
    liquidityPoolX,
    canvasHeight / 1.7,
    addLiquidityERC20
  );
  addLiquidityInput = drawInput(
    liquidityPoolX + addLiquidityButton.width,
    canvasHeight / 1.7,
    50,
    setAddLiquidityInputValue
  );

  removeLiquidityButton = drawButton(
    "removeLiquidityERC20",
    liquidityPoolX,
    canvasHeight / 1.7 + addLiquidityButton.height,
    removeLiquidityERC20
  );
  removeLiquidityInput = drawInput(
    liquidityPoolX + removeLiquidityButton.width,
    canvasHeight / 1.7 + addLiquidityInput.height,
    50,
    setRemoveLiquidityInputValue
  );

  depositButton = drawButton(
    "depositERC20",
    liquidityPoolX,
    canvasHeight / 1.7 + addLiquidityButton.height * 2,
    depositERC20
  );
  depositInput = drawInput(
    liquidityPoolX + depositButton.width,
    canvasHeight / 1.7 + addLiquidityButton.height * 2,
    50,
    setDepositInputValue
  );

  releaseButton = drawButton(
    "releaseERC20",
    liquidityPoolX,
    canvasHeight / 1.7 + addLiquidityButton.height * 3,
    releaseERC20
  );
  releaseInput = drawInput(
    liquidityPoolX + releaseButton.width,
    canvasHeight / 1.7 + releaseButton.height * 3,
    50,
    setReleaseInputValue
  );

  resetButton = drawButton(
    "Reset",
    liquidityPoolX,
    canvasHeight / 1.7 + releaseButton.height * 6,
    reset
  );

  maxPunishmentSlider = drawSlider(
    0,
    100,
    50,
    sliderX,
    sliderY,
    refreshPunishment
  );

  equilibriumLiquiditySlider = drawSlider(
    0,
    100,
    50,
    sliderX + liquidityPoolWidth * 1.8,
    sliderY,
    setEquilibriumLiquidity
  );

  poolLiquiditySlider = drawSlider(
    0,
    100,
    50,
    sliderX + liquidityPoolWidth * 1.8 * 2,
    sliderY,
    setPoolLiquidity
  );

  incentivePoolLiquiditySlider = drawSlider(
    0,
    100,
    0,
    sliderX + liquidityPoolWidth * 1.8 * 3,
    sliderY,
    setIncentivePoolLiquidity
  );
}

function draw() {
  background(255, 255, 255);
  drawLiquidityPool(
    liquidityPoolX,
    liquidityPoolY,
    unscaledEquilibriumLiquidity,
    unscaledLiquidityPoolBalance
  );
  drawInfoText(liquidityPoolX, liquidityPoolY, incentivePoolReward);
  drawIncentivePool(
    incentivePoolX,
    incentivePoolY,
    unscaledIncentivePoolBalance
  );
}

function drawLine(color, x1, y1, x2, y2) {
  stroke(color);
  line(x1, y1, x2, y2);
  stroke("gray");
}

function drawLiquidityPool(
  x,
  y,
  unscaledEquilibriumLiquidity,
  unscaledLiquidityPoolBalance
) {
  rect(x, y, liquidityPoolWidth, liquidityPoolHeight, roundFactor);
  // Equilibrium liquidity line
  strokeWeight(4);
  drawLine(
    "red",
    x,
    y + unscaledEquilibriumLiquidity,
    x + liquidityPoolWidth,
    y + unscaledEquilibriumLiquidity
  );
  // Pool liquidity line
  drawLine(
    "blue",
    x,
    y + unscaledLiquidityPoolBalance,
    x + liquidityPoolWidth,
    y + unscaledLiquidityPoolBalance
  );
  strokeWeight(1);
}

function drawInfoText(x, y, reward) {
  textSize(liquidityPoolHeight / 10);
  const shiftX = liquidityPoolWidth * 1.3;
  const shiftY = textSize();

  text("Liquidity pool", x, y - textSize());
  textSize(liquidityPoolHeight / 10);
  text(
    ` Punishment factor: ${
      !maxPunishmentSlider ? 0 : maxPunishmentSlider.value()
    }`,
    x + shiftX,
    y + (liquidityPoolHeight - shiftY)
  );
  stroke("red");
  text(
    ` Equilibrium liquidity: ${equilibriumLiquidity}`,
    x + shiftX,
    y + (liquidityPoolHeight - 2 * shiftY)
  );
  stroke("blue");
  text(
    ` Liquidity pool balance: ${liquidityPoolBalance}`,
    x + shiftX,
    y + (liquidityPoolHeight - 3 * shiftY)
  );
  stroke("gray");
  text(
    ` Reward / Punishment: ${((reward * incentivePoolHeight) / 100).toFixed(
      3
    )}`,
    x + shiftX,
    y + (liquidityPoolHeight - 4 * shiftY)
  );
  stroke("green");
  text(
    ` Incentive pool balance: ${incentivePoolBalance.toFixed(3)}`,
    x + shiftX,
    y + (liquidityPoolHeight - 5 * shiftY)
  );
  stroke("gray");
  textSize(liquidityPoolHeight / 8);
  text("Stats: ", x + shiftX, y + (liquidityPoolHeight - 6.5 * shiftY));

  textSize(liquidityPoolHeight / 7);
  text("Set starting values", sliderX, sliderY - textSize());
  text(
    "Function call simulator",
    liquidityPoolX,
    canvasHeight / 1.7 - textSize()
  );
  textSize(liquidityPoolHeight / 10);

  text(
    "Punishment factor",
    sliderX,
    sliderY + maxPunishmentSlider.height + 1.1 * textSize()
  );

  text(
    "Equilibrium liquidity",
    sliderX + liquidityPoolWidth * 1.8,
    sliderY + maxPunishmentSlider.height + 1.1 * textSize()
  );

  text(
    "Pool balance",
    sliderX + liquidityPoolWidth * 1.8 * 2,
    sliderY + maxPunishmentSlider.height + 1.1 * textSize()
  );

  text(
    "Incentive pool balance",
    sliderX + liquidityPoolWidth * 1.8 * 3,
    sliderY + maxPunishmentSlider.height + 1.1 * textSize()
  );

  text(
    " - Provide liquidity to the ERC20 bridge. Increases liquidity pool balance and equilibrium liquidity.",
    liquidityPoolX + addLiquidityButton.width + addLiquidityInput.width,
    canvasHeight / 1.7 + addLiquidityButton.height - textSize() / 2
  );

  text(
    " - Remove liquidity from the ERC20 bridge. Decreases liquidity pool balance and equilibrium liquidity.",
    liquidityPoolX + removeLiquidityButton.width + removeLiquidityInput.width,
    canvasHeight / 1.7 + addLiquidityButton.height * 2 - textSize() / 2
  );

  text(
    " - Start bridging by depositing amount of ERC20 tokens. Increases pool balance. Reward is provided if the pool balance is below equilibrium and incentive pool balance > 0.",
    liquidityPoolX + depositButton.width + depositInput.width,
    canvasHeight / 1.7 + addLiquidityButton.height * 3 - textSize() / 2
  );

  text(
    " - Finalize bridging by releasing amount of ERC20 tokens. Decreases pool balance. Punishment is given if the pool balance goes below below equilibrium.",
    liquidityPoolX + releaseButton.width + releaseInput.width,
    canvasHeight / 1.7 + addLiquidityButton.height * 4 - textSize() / 2
  );
}

// Draw functions

function drawIncentivePool(x, y, unscaledLiquidityPoolBalance) {
  textSize(liquidityPoolHeight / 10);
  text("Incentive pool", x, y - textSize());
  rect(x, y, incentivePoolWidth, incentivePoolHeight, roundFactor);
  strokeWeight(4);
  stroke("green");
  line(
    x,
    y - unscaledLiquidityPoolBalance + incentivePoolHeight,
    x + incentivePoolWidth,
    y - unscaledLiquidityPoolBalance + incentivePoolHeight
  );
  strokeWeight(1);
  stroke("gray");
}

function drawButton(text, x, y, handler) {
  const button = createButton(text);
  button.position(x, y);
  button.mousePressed(handler);

  return button;
}

function drawInput(x, y, size, handler) {
  const input = createInput("");
  input.position(x, y);
  input.size(size);
  input.input(handler);

  return input;
}

function drawSlider(minRange, maxRange, startingValue, x, y, handler) {
  const slider = createSlider(minRange, maxRange, startingValue);
  slider.position(x, y);
  slider.style("width", "100px");
  slider.input(handler);

  return slider;
}

// State modifiers

function addLiquidityERC20() {
  const newEquilibriumLiquidity =
    equilibriumLiquidity + Number(addLiquidityInputValue);
  const newliquidityPoolBalance =
    liquidityPoolBalance + Number(addLiquidityInputValue);

  if (newEquilibriumLiquidity <= 100 && newliquidityPoolBalance <= 100) {
    equilibriumLiquidity = newEquilibriumLiquidity;
    unscaledEquilibriumLiquidity -=
      (Number(addLiquidityInputValue) * liquidityPoolHeight) / 100;
    liquidityPoolBalance += Number(addLiquidityInputValue);
    unscaledLiquidityPoolBalance -=
      (Number(addLiquidityInputValue) * liquidityPoolHeight) / 100;
  }

  addLiquidityInput.value("");
}

function removeLiquidityERC20() {
  const newEquilibriumLiquidity =
    equilibriumLiquidity - Number(addLiquidityInputValue);
  const newliquidityPoolBalance =
    liquidityPoolBalance - Number(addLiquidityInputValue);

  if (newEquilibriumLiquidity >= 0 && newliquidityPoolBalance >= 0) {
    equilibriumLiquidity = newEquilibriumLiquidity;
    unscaledEquilibriumLiquidity +=
      (Number(addLiquidityInputValue) * liquidityPoolHeight) / 100;
    liquidityPoolBalance -= Number(addLiquidityInputValue);
    unscaledLiquidityPoolBalance +=
      (Number(addLiquidityInputValue) * liquidityPoolHeight) / 100;
  }

  removeLiquidityInput.value("");
}

function releaseERC20() {
  const newLiquidityPoolBalance =
    liquidityPoolBalance - Number(releaseInputValue);
  if (newLiquidityPoolBalance < 0) {
    return;
  }

  const punishment = getPunishment(
    equilibriumLiquidity,
    liquidityPoolBalance,
    Number(releaseInputValue)
  );

  incentivePoolReward = -punishment;
  unscaledIncentivePoolBalance += (punishment * incentivePoolHeight) / 100;
  incentivePoolBalance += punishment;
  liquidityPoolBalance = newLiquidityPoolBalance;
  unscaledLiquidityPoolBalance +=
    (Number(releaseInputValue) * liquidityPoolHeight) / 100;

  releaseInput.value("");
}

function depositERC20() {
  const newLiquidityPoolBalance =
    liquidityPoolBalance + Number(depositInputValue);
  if (newLiquidityPoolBalance > 100) {
    return;
  }

  const reward = getReward(
    equilibriumLiquidity,
    liquidityPoolBalance,
    incentivePoolBalance,
    Number(depositInputValue)
  );

  incentivePoolReward = reward;
  incentivePoolBalance -= reward;
  unscaledIncentivePoolBalance -= (reward * incentivePoolHeight) / 100;
  liquidityPoolBalance = newLiquidityPoolBalance;
  unscaledLiquidityPoolBalance -=
    (Number(depositInputValue) * liquidityPoolHeight) / 100;

  depositInput.value("");
}

// UTILS

function getReward(
  unscaledEquilibriumLiquidity,
  liquidityPoolBalance,
  incentivePoolBalance,
  depositAmount
) {
  if (
    liquidityPoolBalance >= unscaledEquilibriumLiquidity ||
    incentivePoolBalance == 0
  ) {
    return 0;
  }

  const imbalanceGap = unscaledEquilibriumLiquidity - liquidityPoolBalance;

  if (imbalanceGap === 0) {
    return 0;
  }
  const reward = min(depositAmount / imbalanceGap, 1) * incentivePoolBalance;

  return reward;
}

function getPunishment(
  unscaledEquilibriumLiquidity,
  liquidityPoolBalance,
  withdrawAmount
) {
  const liquidityPoolBalanceAfterWithdrawal =
    liquidityPoolBalance - withdrawAmount;

  if (liquidityPoolBalanceAfterWithdrawal >= unscaledEquilibriumLiquidity) {
    return 0;
  }

  const maxPunishment = withdrawAmount * (maxPunishmentSlider.value() / 100);
  const punishment =
    maxPunishment *
    (1 - liquidityPoolBalanceAfterWithdrawal / unscaledEquilibriumLiquidity);

  return punishment;
}

function refreshPunishment() {
  const punishment = getPunishment(
    equilibriumLiquidity,
    liquidityPoolBalance,
    abs(Number(releaseInputValue))
  );
  const reward = getReward(
    liquidityPoolHeight - unscaledEquilibriumLiquidity,
    liquidityPoolHeight - unscaledLiquidityPoolBalance,
    unscaledIncentivePoolBalance,
    Number(depositInputValue)
  );
  incentivePoolReward = punishment !== 0 ? -punishment : reward;
}

function reset() {
  incentivePoolBalance = 0;
  incentivePoolReward = 0;
  equilibriumLiquidity = 50;
  liquidityPoolBalance = 50;

  unscaledEquilibriumLiquidity = liquidityPoolHeight / 2;
  unscaledLiquidityPoolBalance = unscaledEquilibriumLiquidity;
  unscaledIncentivePoolBalance = 0;

  maxPunishmentSlider.value(50);
  equilibriumLiquiditySlider.value(50);
  poolLiquiditySlider.value(50);
  incentivePoolLiquiditySlider.value(0);
}

// Setters

function setAddLiquidityInputValue() {
  addLiquidityInputValue = this.value();
}

function setRemoveLiquidityInputValue() {
  removeLiquidityInputValue = this.value();
}

function setDepositInputValue() {
  depositInputValue = this.value();

  refreshPunishment();
}

function setReleaseInputValue() {
  releaseInputValue = this.value();

  refreshPunishment();
}

function setPoolLiquidity() {
  liquidityPoolBalance = this.value();
  unscaledLiquidityPoolBalance =
    liquidityPoolHeight - (liquidityPoolBalance * liquidityPoolHeight) / 100;
}

function setIncentivePoolLiquidity() {
  incentivePoolBalance = this.value();
  unscaledIncentivePoolBalance =
    (incentivePoolBalance * incentivePoolHeight) / 100;
  incentivePoolBalance = incentivePoolBalance;
}

function setEquilibriumLiquidity() {
  equilibriumLiquidity = this.value();
  unscaledEquilibriumLiquidity =
    liquidityPoolHeight - (equilibriumLiquidity * liquidityPoolHeight) / 100;
}
