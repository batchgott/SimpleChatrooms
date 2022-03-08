﻿using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using simple_chatrooms_backend.Entities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace simple_chatrooms_backend.Services {
    public class TokenService : ITokenService {
        private readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration config) {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }

        public string CreateToken(User user) {
            var claims = new List<Claim>
           {
               new Claim(JwtRegisteredClaimNames.UniqueName,user.Username)
           };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(claims),
                Expires = null,
                SigningCredentials = creds,
            };



            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}