package com.Project.BazarV1.DTO;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"username", "password"})
public record AuthenticationRequest(String username, String password) {
}
