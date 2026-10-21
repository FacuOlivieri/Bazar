package com.Project.BazarV1.Mapper;

import com.Project.BazarV1.DTO.ClientDTO;
import com.Project.BazarV1.DTO.CouponDTO;
import com.Project.BazarV1.DTO.PermissionDTO;
import com.Project.BazarV1.DTO.ProductDTO;
import com.Project.BazarV1.DTO.RoleDTO;
import com.Project.BazarV1.DTO.SaleDTO;
import com.Project.BazarV1.DTO.SaleDetailDTO;
import com.Project.BazarV1.DTO.UserDTO;
import com.Project.BazarV1.Model.Client;
import com.Project.BazarV1.Model.Coupon;
import com.Project.BazarV1.Model.Permission;
import com.Project.BazarV1.Model.Product;
import com.Project.BazarV1.Model.Role;
import com.Project.BazarV1.Model.Sale;
import com.Project.BazarV1.Model.SaleDetail;
import com.Project.BazarV1.Model.UserSec;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Mapper {

    public static ClientDTO toClientDTO(Client client) {

        return ClientDTO.builder()
                .idClientDTO(client.getIdClient())
                .name(client.getName())
                .surname(client.getSurname())
                .adress(client.getAdress())
                .phone(client.getPhone())
                .email(client.getEmail())
                .dni(client.getDni())
                .build();
    }

    public static CouponDTO toCouponDTO(Coupon coupon) {
        return CouponDTO.builder()
                .idCoupon(coupon.getIdCoupon())
                .identifier(coupon.getIdentifier())
                .discount(coupon.getDiscount())
                .used(coupon.getUsed())
                .build();
    }

    public static ProductDTO toProductDTO(Product product) {
        return ProductDTO.builder()
                .idProduct(product.getIdProduct())
                .name(product.getName())
                .brand(product.getBrand())
                .quantity(product.getQuantity())
                .price(product.getPrice())
                .stock(product.getStock())
                .build();


    }

    public static SaleDTO toSaleDTO(Sale sale) {
        return SaleDTO.builder()
                .id(sale.getId())
                .date(sale.getDate())
                .client(toClientDTO(sale.getClient()))
                .products(toSaleDetailDTO(sale.getProducts()))
                .totalPrice(sale.getTotalPrice())
                .coupon(sale.getCoupon() != null ? toCouponDTO(sale.getCoupon()) : null)
                .build();

    }

    public static PermissionDTO toPermissionDTO(Permission permission) {
        return PermissionDTO.builder()
                .idPermission(permission.getIdPermission())
                .permissionName(permission.getPermissionName())
                .build();
    }

    public static RoleDTO toRoleDTO(Role role) {
        return RoleDTO.builder()
                .idRole(role.getIdRole())
                .role(role.getRole())
                .permissions(role.getPermissionsList().stream()
                        .map(Permission::getPermissionName)
                        .collect(Collectors.toSet()))
                .build();
    }

    //La password no se mapea: nunca sale del service
    public static UserDTO toUserDTO(UserSec user) {
        return UserDTO.builder()
                .idUser(user.getIdUser())
                .username(user.getUsername())
                .enabled(user.isEnabled())
                .accountNotExpired(user.isAccountNotExpired())
                .accountNotLocked(user.isAccountNotLocked())
                .credentialNotExpired(user.isCredentialNotExpired())
                .roles(user.getRolesList().stream()
                        .map(Role::getRole)
                        .collect(Collectors.toSet()))
                .build();
    }

    private static List<SaleDetailDTO> toSaleDetailDTO(List<SaleDetail> products) {
        List<SaleDetailDTO> saleDetailDTOs = new ArrayList<>();
        for (SaleDetail product : products) {
            SaleDetailDTO detail = SaleDetailDTO.builder()
                    .id(product.getIdSaleDetail())
                    .productName(product.getProductName())
                    .quantity(product.getQuantity())
                    .unitPrice(product.getUnitPrice())
                    .subtotal(product.getTotal())
                    .build();
                    saleDetailDTOs.add(detail);
        }
        return saleDetailDTOs;
    }
}
