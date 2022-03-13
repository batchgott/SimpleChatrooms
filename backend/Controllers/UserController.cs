﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using simple_chatrooms_backend.Entities;
using simple_chatrooms_backend.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace simple_chatrooms_backend.Controllers {

    [Authorize]
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase {

        private readonly IUserRepository<User> _userRepository;

        public UserController(IUserRepository<User> userRepository) {
            _userRepository = userRepository;
        }

        [HttpPost("{userId}/set-profile-picture")]
        public IActionResult SetProfilePicture(Guid userId, [FromForm] IFormFile image) {
            var user = _userRepository.GetOne(userId);
            try {
                string path = "Images\\";
                string fileName = Guid.NewGuid().ToString() + System.IO.Path.GetExtension(image.FileName);

                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                if (user.ProfilePicture != null && System.IO.File.Exists(path + user.ProfilePicture))
                    System.IO.File.Delete(path + user.ProfilePicture);

                using (FileStream fileStream = System.IO.File.Create(path + fileName)) {
                    image.CopyTo(fileStream);
                    fileStream.Flush();
                    user.ProfilePicture = fileName;
                    _userRepository.Update(user);
                    _userRepository.Save();
                    return Ok(user);
                }

            } catch (Exception ex) {
                return StatusCode(500);
            }
        }
    }
}