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
let equilibriumLiquidity = 50;
let liquidityPoolBalance = 50;

// Incentive pool
let incentivePoolWidth;
let incentivePoolHeight;

let incentivePoolX;
let incentivePoolY;

let incentivePoolBalance = 0;
let incentivePoolReward = 0;

let maxPunishmentSlider;
let equilibriumLiquiditySlider;
let poolLiquiditySlider;

function setup() {
  canvasWidth = displayWidth;
  canvasHeight = displayHeight;

  marginX = canvasWidth / 7;
  marginY = canvasHeight / 6;

  liquidityPoolWidth = canvasWidth / 15;
  liquidityPoolHeight = canvasHeight / 7;

  incentivePoolWidth = canvasWidth / 30;
  incentivePoolHeight = canvasHeight / 14;

  unscaledEquilibriumLiquidity = liquidityPoolHeight / 2;
  unscaledLiquidityPoolBalance = unscaledEquilibriumLiquidity;

  liquidityPoolX = canvasWidth / 2 - 3 * liquidityPoolWidth - marginX;
  liquidityPoolY = canvasHeight / 2 - liquidityPoolHeight - marginY;

  incentivePoolX =
    canvasWidth / 2 - 3 * incentivePoolWidth - marginX + incentivePoolWidth * 2;
  incentivePoolY = canvasHeight / 2 - incentivePoolHeight - marginY;

  createCanvas(canvasWidth, canvasHeight);

  addLiquidityButton = drawButton(
    "addLiquidityERC20",
    liquidityPoolX,
    canvasHeight / 2,
    addLiquidityERC20
  );
  addLiquidityInput = drawInput(
    liquidityPoolX + addLiquidityButton.width,
    canvasHeight / 2,
    50,
    setAddLiquidityInputValue
  );

  removeLiquidityButton = drawButton(
    "removeLiquidityERC20",
    liquidityPoolX,
    canvasHeight / 2 + addLiquidityButton.height,
    removeLiquidityERC20
  );
  removeLiquidityInput = drawInput(
    liquidityPoolX + removeLiquidityButton.width,
    canvasHeight / 2 + addLiquidityInput.height,
    50,
    setRemoveLiquidityInputValue
  );

  depositButton = drawButton(
    "depositERC20",
    liquidityPoolX,
    canvasHeight / 2 + addLiquidityButton.height * 2,
    depositERC20
  );
  depositInput = drawInput(
    liquidityPoolX + depositButton.width,
    canvasHeight / 2 + addLiquidityButton.height * 2,
    50,
    setDepositInputValue
  );

  releaseButton = drawButton(
    "releaseERC20",
    liquidityPoolX,
    canvasHeight / 2 + addLiquidityButton.height * 3,
    releaseERC20
  );
  depositInput = drawInput(
    liquidityPoolX + releaseButton.width,
    canvasHeight / 2 + releaseButton.height * 3,
    50,
    setReleaseInputValue
  );

  resetButton = drawButton(
    "Reset",
    liquidityPoolX,
    canvasHeight / 2 + releaseButton.height * 8,
    reset
  );

  maxPunishmentSlider = drawSlider(
    0,
    100,
    50,
    liquidityPoolX,
    canvasHeight / 2 + depositButton.height * 5.55,
    refreshPunishment
  );

  equilibriumLiquiditySlider = drawSlider(
    0,
    100,
    50,
    liquidityPoolX + canvasWidth / 10,
    canvasHeight / 2 + depositButton.height * 5.55,
    setEquilibriumLiquidity
  );

  poolLiquiditySlider = drawSlider(
    0,
    100,
    50,
    liquidityPoolX + (canvasWidth / 10) * 2,
    canvasHeight / 2 + depositButton.height * 5.55,
    setPoolLiquidity
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
  drawIncentivePool(incentivePoolX, incentivePoolY, incentivePoolBalance);
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
}

function drawInfoText(x, y, reward) {
  text("Liquidity pool", x, y - textSize());
  stroke("red");
  text(
    `Equilibrium liquidity: ${equilibriumLiquidity}`,
    x,
    y + liquidityPoolHeight + 2 * textSize()
  );
  stroke("blue");
  text(
    `Liquidity pool balance: ${liquidityPoolBalance}`,
    x,
    y + liquidityPoolHeight + 3 * textSize()
  );
  stroke("gray");
  text(
    `Reward / Punishment: ${reward}`,
    x,
    y + liquidityPoolHeight + 4 * textSize()
  );
  stroke("green");
  text(
    `Incentive pool balance: ${incentivePoolBalance}`,
    x,
    y + liquidityPoolHeight + 5 * textSize()
  );
  stroke("gray");
  text(
    `Punishment factor: ${
      !maxPunishmentSlider ? 0 : maxPunishmentSlider.value()
    }`,
    x,
    y + liquidityPoolHeight + 6 * textSize()
  );
  text(
    "Function call simulator",
    liquidityPoolX,
    canvasHeight / 2 - textSize()
  );
  textSize(liquidityPoolHeight / 10);
  text(
    "Punishment",
    liquidityPoolX,
    canvasHeight / 2 + depositButton.height * 5.25
  );
  text(
    "Equilibrium",
    liquidityPoolX + canvasWidth / 10,
    canvasHeight / 2 + depositButton.height * 5.25
  );
  text(
    "Liquidity",
    liquidityPoolX + (canvasWidth / 10) * 2,
    canvasHeight / 2 + depositButton.height * 5.25
  );
  textSize(liquidityPoolHeight / 8);
}

// Draw functions

function drawIncentivePool(x, y, unscaledLiquidityPoolBalance) {
  textSize(liquidityPoolHeight / 8);
  text("Incentive pool", x, y - textSize());
  rect(x, y, incentivePoolWidth, incentivePoolHeight, roundFactor);
  stroke("green");
  line(
    x,
    y - unscaledLiquidityPoolBalance + incentivePoolHeight,
    x + incentivePoolWidth,
    y - unscaledLiquidityPoolBalance + incentivePoolHeight
  );
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
  incentivePoolBalance += punishment;
  liquidityPoolBalance = newLiquidityPoolBalance;
  unscaledLiquidityPoolBalance +=
    (Number(releaseInputValue) * liquidityPoolHeight) / 100;
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
  incentivePoolBalance -= incentivePoolReward;
  liquidityPoolBalance = newLiquidityPoolBalance;
  unscaledLiquidityPoolBalance -=
    (Number(depositInputValue) * liquidityPoolHeight) / 100;
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
    incentivePoolBalance,
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

  maxPunishmentSlider.value(50);
  equilibriumLiquiditySlider.value(50);
  poolLiquiditySlider.value(50);
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

function setEquilibriumLiquidity() {
  equilibriumLiquidity = this.value();
  unscaledEquilibriumLiquidity =
    liquidityPoolHeight - (equilibriumLiquidity * liquidityPoolHeight) / 100;
}
