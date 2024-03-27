-- Group 173
-- Saudi America
-- Chris Katsoulis & William Demsar

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Orders, Securities, SecurityCodes, SecurityCodesSecurities, Investors, InvestorTypes, 
Positions;

--
-- CREATE TABLES
--

-- Create Orders Table
CREATE TABLE Orders (
    orderID INT PRIMARY KEY AUTO_INCREMENT,
    investorID INT NOT NULL,
    securityID INT NOT NULL,
    positionID INT NOT NULL,
    orderType VARCHAR(255) NOT NULL,
    totalUnits DECIMAL(65, 2),
    price DECIMAL(65, 2) NOT NULL,
    tradeTotal DECIMAL(65, 2) AS (totalUnits*price),
    date DATE NOT NULL,
    FOREIGN KEY (securityID) REFERENCES Securities(securityID),
    FOREIGN KEY (investorID) REFERENCES Investors(investorID),
    FOREIGN KEY (positionID) REFERENCES Positions(positionID) ON UPDATE CASCADE  
);



-- Create Securities Table
CREATE TABLE Securities (
    securityID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    ticker VARCHAR(255) NOT NULL,
    currentPrice DECIMAL(65, 2) NOT NULL
);


-- Create SecurityCodes Table
CREATE TABLE SecurityCodes (
    securityCodeID INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(255) NOT NULL
);


-- Create SecurityCodesSecurities Table
CREATE TABLE SecurityCodesSecurities (
    scsID INT PRIMARY KEY AUTO_INCREMENT,
    securityID INT NOT NULL,
    securityCodeID INT NOT NULL,
    FOREIGN KEY (securityID) REFERENCES Securities(securityID),
    FOREIGN KEY (securityCodeID) REFERENCES SecurityCodes(securityCodeID)
);


-- Create Investors Table
CREATE TABLE Investors (
    investorID INT PRIMARY KEY AUTO_INCREMENT,
    investorTypeID INT,
    name VARCHAR(255) NOT NULL,
    cashBalance DECIMAL(65, 2) NOT NULL,
    portfolioBalance DECIMAL(65, 2) NOT NULL,
    portfolioPerformance DECIMAL(65, 2) NOT NULL,
    FOREIGN KEY (investorTypeID) REFERENCES InvestorTypes(investorTypeID)
);



-- Create InvestorTypes Table
CREATE TABLE InvestorTypes (
    investorTypeID INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(255) NOT NULL
);


-- Create Positions Table
CREATE TABLE Positions (
    positionID INT PRIMARY KEY AUTO_INCREMENT,
    investorID INT NOT NULL,
    securityID INT NOT NULL,
    units DECIMAL(65, 2) NOT NULL,
    initialValue DECIMAL(65, 2),
    currentValue DECIMAL(65, 2),
    gainLoss DECIMAL(65, 2),
    FOREIGN KEY (investorID) REFERENCES Investors(investorID),
    FOREIGN KEY (securityID) REFERENCES Securities(securityID) 
);


--
-- INSERT DATA
--

-- Insert Orders Data
INSERT INTO Orders (orderID, investorID, securityID, positionID, orderType, totalUnits, price, tradeTotal, date)
VALUES
(1, 3, 4, 1, 'Buy', 200000, 1.00, 200000.00, '2021-04-20'),
(2, 2, 8, 2, 'Buy', 500000, 360.00, 180000000.00, '2023-06-15'),
(3, 2, 9, 3, 'Buy', 700000, 250.00, 175000000.00, '2023-06-15'),
(4, 1, 7, 4, 'Buy', 10000000, 400.00, 4000000000.00, '2023-10-27'),
(5, 1, 2, 5, 'Buy', 100000, 25000.00, 2500000000.00, '2023-10-27'),
(6, 2, 9, 3, 'Sell', 600000, 260.00, 156000000.00, '2023-12-27'),
(7, 1, 2, 5, 'Sell', 50000, 40000.00, 2000000000.00, '2024-01-24');

-- Insert Securities Data
INSERT INTO Securities (securityID, name, ticker, currentPrice)
VALUES
(1, 'Apple Inc.', 'AAPL', 190.00),
(2, 'Bitcoin', 'BTC', 43000.00),
(3, 'Ethereum', 'ETH', 2400.00),
(4, 'GameStop Corp.', 'GME', 14.00),
(5, 'Immutable', 'IMX', 2.00),
(6, 'Invesco QQQ Trust', 'QQQ', 430.00),
(7, 'NVIDIA', 'NVDA', 680.00),
(8, 'SPDR S&P 500 ETF Trust', 'SPY', 500.00),
(9, 'Tesla Inc.', 'TSLA', 185.00),
(10, 'Vanguard Total Stock Market ETF', 'VTI', 250.00);

-- Insert SecurityCodes Data
INSERT INTO SecurityCodes (securityCodeID, description)
VALUES
(1, 'Cryptocurrency'),
(2, 'Stock'),
(3, 'Exchange Traded Fund'),
(4, 'Popular/trending securities'),
(5, 'Stock will report quarterly earnings this week'),
(6, 'Ethereum-based cryptocurrency');

-- Insert SecurityCodesSecurities Data
INSERT INTO SecurityCodesSecurities (scsID, securityID, securityCodeID)
VALUES
(1, 1, 1),
(2, 2, 2),
(3, 2, 2),
(4, 3, 3),
(5, 4, 4),
(6, 5, 5),
(7, 5, 5),
(8, 6, 6),
(9, 7, 7),
(10, 7, 7),
(11, 8, 8),
(12, 8, 8),
(13, 9, 9),
(14, 9, 9),
(15, 10, 10);

-- Insert Investors Data
INSERT INTO Investors (investorID, investorTypeID, name, cashBalance, portfolioBalance, portfolioPerformance)
VALUES
(1, 1, 'J.P. Morgan Chase & Co.', 2000000000.00, 8950000000.00, 4450000000.00),
(2, 2, 'Axe Capital', 156000000.00, 268500000.00, 69500000.00),
(3, 3, 'Keith Gill', 0.00, 2800000.00, 2600000.00);

-- Insert InvestorTypes Data
INSERT INTO InvestorTypes (investorTypeID, description)
VALUES
(1, 'Bank'),
(2, 'Hedge Fund'),
(3, 'Individual'),
(4, 'Broker'),
(5, 'Market Maker');

-- Insert Positions Data
INSERT INTO Positions (positionID, investorID, securityID, units, initialValue, currentValue, gainLoss)
VALUES
(1, 3, 4, 200000, 200000.00, 2800000.00, 2600000.00),
(2, 2, 8, 500000, 180000000.00, 250000000.00, 70000000.00),
(3, 2, 9, 100000, 175000000.00, 18500000.00, -500000.00),
(4, 1, 7, 10000000, 4000000000.00, 6800000000.00, 2800000000.00),
(5, 1, 2, 50000, 2500000000.00, 2150000000.00, 1650000000.00);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;
