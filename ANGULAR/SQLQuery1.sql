CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    OrderDate DATETIME,
    CustomerName NVARCHAR(100),
    TotalAmount DECIMAL(18, 2)
);

CREATE TABLE OrderDetails (
    OrderDetailID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT,
    ProductName NVARCHAR(100),
    Quantity INT,
    UnitPrice DECIMAL(18, 2),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);


CREATE TYPE OrderDetailsType AS TABLE (
    ProductName NVARCHAR(100),
    Quantity INT,
    UnitPrice DECIMAL(18, 2)
);

CREATE PROCEDURE AddOrderWithDetails
    @OrderDate DATETIME,
    @CustomerName NVARCHAR(100),
    @TotalAmount DECIMAL(18, 2),
    @OrderDetails OrderDetailsType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OrderID INT;

    INSERT INTO Orders (OrderDate, CustomerName, TotalAmount)
    VALUES (@OrderDate, @CustomerName, @TotalAmount);

    SET @OrderID = SCOPE_IDENTITY();

    INSERT INTO OrderDetails (OrderID, ProductName, Quantity, UnitPrice)
    SELECT @OrderID, ProductName, Quantity, UnitPrice
    FROM @OrderDetails;
END;
