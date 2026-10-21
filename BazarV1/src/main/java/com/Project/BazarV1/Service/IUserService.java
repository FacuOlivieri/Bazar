package com.Project.BazarV1.Service;

import com.Project.BazarV1.DTO.UserDTO;

import java.util.List;

public interface IUserService {

    UserDTO createUser(UserDTO userDTO);
    UserDTO updateUser(Long id, UserDTO userDTO);
    List<UserDTO> findAllUsers();
    UserDTO findUser(Long id);
    void deleteUser(Long id);

}
