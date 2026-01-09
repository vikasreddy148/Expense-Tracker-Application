package com.expensetracker.expensetracker.dto.response;

import com.expensetracker.expensetracker.enums.AuthProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private AuthProvider provider;
    private Set<String> roles;
}

