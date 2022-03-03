let canvasWidth = 800;
let canvasHeight = 500;

let liquidityInputValue = 0;

const marginX = canvasWidth / 7;
const marginY = canvasHeight / 6;

// Buttons and inputs
let liquidityButton;
let provideLiquidityInput;
let depositButton;
let depositValue;
let depositInput;

// Liquidity pool dimensions
const liquidityPoolWidth = 55;
const liquidityPoolHeight = 100;
const roundFactor = 10;

const liquidityPoolX = canvasWidth/2 - 3 * liquidityPoolWidth - marginX;
const liquidityPoolY = canvasHeight/2 - liquidityPoolHeight - marginY;
let equilibriumLiquidity = liquidityPoolHeight / 2;
let currentLiquidity = equilibriumLiquidity;

// Incentive pool
const incentivePoolWidth = 50
const incentivePoolHeight = 40;

const incentivePoolX = canvasWidth/2 - 3 * incentivePoolWidth - marginX + incentivePoolWidth * 2;
const incentivePoolY = canvasHeight/2 - incentivePoolHeight - marginY;

let incentivePoolAmount = 0;
let incentivePoolReward = 0;

let maxPunishmentSlider;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  textSize(32);

  drawLiquidityButton();
  drawLiquidityInput();
  drawDepositButton();
  drawDepositInput();
  drawMaxPunishmentSlider();
  drawResetButton();
}

function draw() {
  background(255,255,255);
  // Draw liquidity pools
  drawLiquidityPool(liquidityPoolX, liquidityPoolY, equilibriumLiquidity, currentLiquidity, incentivePoolReward);
  drawIncentivePool(incentivePoolX, incentivePoolY, incentivePoolAmount)
  textSize(liquidityPoolHeight / 9);
  text(' - Simulates addLiquidityERC20 and removeLiquidityERC20',liquidityPoolX + liquidityButton.width + depositInput.width, canvasHeight/2 + textSize());
  text(' - Simulates depositERC20 and releaseERC20',liquidityPoolX + liquidityButton.width + depositInput.width, canvasHeight/2 + depositInput.height + textSize());
  text('**for the sake of testing max values for liquidity and equilibrium liquidity are 100',liquidityPoolX + liquidityButton.width + depositInput.width, canvasHeight/2 + depositInput.height * 6 + textSize());
}

function drawLiquidityPool(x, y, equilibriumLiquidity, currentLiquidity, reward) {
  rect(x, y, liquidityPoolWidth, liquidityPoolHeight, roundFactor);
  stroke('red');
  line(x, y + equilibriumLiquidity, x + liquidityPoolWidth, y + equilibriumLiquidity);
  stroke('blue');
  line(x, y + currentLiquidity, x + liquidityPoolWidth, y + currentLiquidity);
  stroke('gray');
  
  textSize(liquidityPoolHeight / 8);
  text('Liquidity pool', x, y - textSize());
  
  stroke('blue');
  text(`Equilibrium liquidity: ${liquidityPoolHeight - equilibriumLiquidity}`, x, y + liquidityPoolHeight + 2 * textSize());
  stroke('red');
  text(`Liquidity pool balance: ${liquidityPoolHeight - currentLiquidity}`, x, y + liquidityPoolHeight + 3 * textSize());
  stroke('gray');
  text(`Reward / Punishment: ${reward}`, x, y + liquidityPoolHeight + 4 * textSize());
  stroke('green');
  text(`Incentive pool balance: ${incentivePoolAmount}`, x, y + liquidityPoolHeight + 5 * textSize());
  stroke('gray');
  
  text(`Punishment factor: ${!maxPunishmentSlider? 0:maxPunishmentSlider.value()}`, liquidityPoolX, canvasHeight/2 + depositButton.height * 3);
}

function drawIncentivePool(x, y, currentLiquidity) {
  textSize(liquidityPoolHeight / 8);
  text('Incentive pool', x, y - textSize());
  rect(x, y, incentivePoolWidth, incentivePoolHeight, roundFactor);
  stroke('green');
  line(x, y - currentLiquidity + incentivePoolHeight, x + incentivePoolWidth, y - currentLiquidity + incentivePoolHeight);
  stroke('gray');
}

function drawLiquidityButton() {
  liquidityButton = createButton('Provide / Remove liquidity');
  liquidityButton.position(liquidityPoolX, canvasHeight/2);
  liquidityButton.mousePressed(addLiquidity);
}

function drawLiquidityInput() {
  provideLiquidityInput = createInput('');
  provideLiquidityInput.position(liquidityPoolX + liquidityButton.width, canvasHeight/2);
  provideLiquidityInput.size(50);
  provideLiquidityInput.input(setLiquidityInputValue);
}


function drawDepositButton() {
  depositButton = createButton('Deposit / Withdraw tokens');
  depositButton.position(liquidityPoolX, canvasHeight/2 + depositButton.height);
  depositButton.mousePressed(deposit);
}

function drawDepositInput() {
  depositInput = createInput('');
  depositInput.position(liquidityPoolX + depositButton.width, canvasHeight/2 + depositInput.height);
  depositInput.size(50);
  depositInput.input(setDepositInputValue);
}

function drawResetButton() {
  depositButton = createButton('Reset');
  depositButton.position(depositInput.x, canvasHeight/2 + depositButton.height * 4);
  depositButton.mousePressed(reset);
}

function drawMaxPunishmentSlider() {
  maxPunishmentSlider = createSlider(0, 100, 50);
  maxPunishmentSlider.position(liquidityPoolX, canvasHeight/2 + depositButton.height * 3.25);
  maxPunishmentSlider.style('width', '80px');
  maxPunishmentSlider.input(refreshPunishment);
}

function addLiquidity() {
  const newLiquidity = equilibriumLiquidity - Number(liquidityInputValue);

  if (newLiquidity > 0 && newLiquidity <= liquidityPoolHeight) {
    equilibriumLiquidity -= Number(liquidityInputValue);
    currentLiquidity -= Number(liquidityInputValue);
  }
  
  equilibriumLiquidity1Value = liquidityPoolHeight - equilibriumLiquidity;
}

function deposit() {
  const newCurrentLiquidity = currentLiquidity - Number(depositValue);
  if(newCurrentLiquidity < 0 || newCurrentLiquidity > liquidityPoolHeight) {
    return;
  }
  
  if(newCurrentLiquidity < currentLiquidity) {
    incentivePoolReward = getReward(liquidityPoolHeight - equilibriumLiquidity, liquidityPoolHeight - currentLiquidity, incentivePoolAmount, Number(depositValue));
    incentivePoolAmount -= incentivePoolReward;
  }
  else {
    const punishment = getPunishment(liquidityPoolHeight - equilibriumLiquidity, liquidityPoolHeight - currentLiquidity, incentivePoolAmount, abs(Number(depositValue)));
    incentivePoolReward = -punishment;
    incentivePoolAmount += punishment;
  }
  
 currentLiquidity = newCurrentLiquidity;
  
}


function getReward(equilibriumLiquidity, liquidityPoolBalance, incentivePoolBalance, depositAmount) {
    if (liquidityPoolBalance >= equilibriumLiquidity || incentivePoolBalance == 0) {
      return 0;
    }
  
    const imbalanceGap = equilibriumLiquidity - liquidityPoolBalance;
    
    if(imbalanceGap === 0) {
      return 0;
    }
  
    const reward = min(depositAmount / imbalanceGap, 1) * incentivePoolBalance;

    return reward;
}

function getPunishment(equilibriumLiquidity, liquidityPoolBalance, incentivePoolBalance, withdrawAmount) {
    const liquidityPoolBalanceAfterWithdrawal = liquidityPoolBalance - withdrawAmount;

    if (liquidityPoolBalanceAfterWithdrawal >= equilibriumLiquidity) {
      return 0;
    }

    const maxPunishment = withdrawAmount * (maxPunishmentSlider.value() / 100);
    const punishment = maxPunishment * (1-liquidityPoolBalanceAfterWithdrawal/equilibriumLiquidity);

    return punishment;
}

function setLiquidityInputValue() {
  liquidityInputValue = this.value();
}

function setDepositInputValue() {
  depositValue = this.value();
  
  refreshPunishment();
}

function refreshPunishment() {
  if(depositValue < 0) {
  const punishment = getPunishment(liquidityPoolHeight - equilibriumLiquidity, liquidityPoolHeight - currentLiquidity, incentivePoolAmount, abs(Number(depositValue)));
    incentivePoolReward = -punishment;
  }
  else {
    incentivePoolReward = getReward(liquidityPoolHeight - equilibriumLiquidity, liquidityPoolHeight - currentLiquidity, incentivePoolAmount, Number(depositValue));
       }
}

function reset() {
 incentivePoolAmount = 0;
 incentivePoolReward = 0;
 equilibriumLiquidity = liquidityPoolHeight / 2;
 currentLiquidity = equilibriumLiquidity;
 maxPunishmentSlider.value(50);
}