CREATE DATABASE InventarioDB;
GO

USE InventarioDB;
GO

CREATE TABLE Productos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255),
    CantidadStock INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    FechaRegistro DATE NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Usuarios (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    NombreUsuario NVARCHAR(50) NOT NULL UNIQUE,
    Contrasena NVARCHAR(50) NOT NULL
);
GO

-- Insertar un usuario de prueba
INSERT INTO Usuarios (NombreUsuario, Contrasena)
VALUES ('admin', '12345');
GO
select *from Productos