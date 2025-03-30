package com.enterprise.projectmanagement.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Entity
@Table(name = "roles")
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @Enumerated(EnumType.STRING)
//    @Column(length = 20, unique = true, nullable = false)
//    private RoleType name;

    @Column(name = "name", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private RoleType name;

    public enum RoleType {
        ROLE_ADMIN, ROLE_MANAGER, ROLE_USER, ROLE_GUEST
    }
}