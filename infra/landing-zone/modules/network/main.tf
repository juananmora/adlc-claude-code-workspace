# Modulo network - Azure.
# Crea:
#   - Resource Group base de la landing zone.
#   - VNet con tres subredes:
#       * subnet-cae : Container Apps Environment (delegada a Microsoft.App/environments).
#       * subnet-sql : Private Endpoint para Azure SQL.
#       * subnet-pe  : Private Endpoints adicionales (Key Vault, Storage, etc.).
#   - NSG minimo asociado a cada subred (deny por defecto, allow intra-VNet).
#
# Notas de seguridad:
#   - Ninguna subred expone IPs publicas; el acceso externo entra por
#     Container Apps Environment / Static Web App.
#   - Reglas NSG: ningun 0.0.0.0/0 inbound.

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  tags = merge(var.tags, {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
    module      = "network"
  })
}

resource "azurerm_resource_group" "this" {
  name     = "${local.name_prefix}-rg"
  location = var.location
  tags     = local.tags
}

resource "azurerm_virtual_network" "this" {
  name                = "${local.name_prefix}-vnet"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  address_space       = [var.vnet_cidr]
  tags                = local.tags
}

# Subred dedicada al Container Apps Environment.
# La delegacion a Microsoft.App/environments es OBLIGATORIA para que
# el plano de control de ACA pueda gestionar la subred.
resource "azurerm_subnet" "cae" {
  name                 = "subnet-cae"
  resource_group_name  = azurerm_resource_group.this.name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = [var.subnet_cae_cidr]

  delegation {
    name = "aca-delegation"
    service_delegation {
      name = "Microsoft.App/environments"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/join/action",
      ]
    }
  }
}

# Subred para el Private Endpoint de Azure SQL.
resource "azurerm_subnet" "sql" {
  name                              = "subnet-sql"
  resource_group_name               = azurerm_resource_group.this.name
  virtual_network_name              = azurerm_virtual_network.this.name
  address_prefixes                  = [var.subnet_sql_cidr]
  private_endpoint_network_policies = "Disabled"
}

# Subred para el resto de Private Endpoints (KV, Storage, etc.).
resource "azurerm_subnet" "pe" {
  name                              = "subnet-pe"
  resource_group_name               = azurerm_resource_group.this.name
  virtual_network_name              = azurerm_virtual_network.this.name
  address_prefixes                  = [var.subnet_pe_cidr]
  private_endpoint_network_policies = "Disabled"
}

# NSGs minimos. Deny por defecto + allow intra-VNet en 443.
resource "azurerm_network_security_group" "cae" {
  name                = "${local.name_prefix}-nsg-cae"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  tags                = local.tags

  security_rule {
    name                       = "allow-vnet-inbound-https"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "VirtualNetwork"
  }
}

resource "azurerm_network_security_group" "sql" {
  name                = "${local.name_prefix}-nsg-sql"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  tags                = local.tags

  security_rule {
    name                       = "allow-vnet-inbound-sql"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "1433"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "VirtualNetwork"
  }
}

resource "azurerm_network_security_group" "pe" {
  name                = "${local.name_prefix}-nsg-pe"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  tags                = local.tags
}

resource "azurerm_subnet_network_security_group_association" "cae" {
  subnet_id                 = azurerm_subnet.cae.id
  network_security_group_id = azurerm_network_security_group.cae.id
}

resource "azurerm_subnet_network_security_group_association" "sql" {
  subnet_id                 = azurerm_subnet.sql.id
  network_security_group_id = azurerm_network_security_group.sql.id
}

resource "azurerm_subnet_network_security_group_association" "pe" {
  subnet_id                 = azurerm_subnet.pe.id
  network_security_group_id = azurerm_network_security_group.pe.id
}
