﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AngularJsWebApp.API.Authentication;
using AngularJsWebApp.API.Entities;
using AngularJsWebApp.API.Models;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;

namespace AngularJsWebApp.API.Controllers
{
    [RoutePrefix("sso/WindowsAuthentication")]
    public class WindowsAuthenticationController : ApiController
    {
        public WindowsAuthenticationController()
        {
        }

        // GET sso/WindowsAuthentication/Logon
        [Route("Logon")]
        [HttpPost]
        public async Task<IHttpActionResult> Logon(WindowsLogonModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string authenticatedUserName = System.Web.HttpContext.Current.User.Identity.Name;

            // Generate the bearer token
            var identity = new ClaimsIdentity(model.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Name, authenticatedUserName));
            identity.AddClaim(new Claim("sub", authenticatedUserName));
            identity.AddClaim(new Claim("role", "user"));

            var props = new AuthenticationProperties(new Dictionary<string, string>()
            {
                { "as:client_id", model.ClientId ?? String.Empty },
                { "userName", authenticatedUserName }
            });

            var ticket = new AuthenticationTicket(identity, props);

            var context = new Microsoft.Owin.Security.Infrastructure.AuthenticationTokenCreateContext(
                Request.GetOwinContext(),
                Startup.OAuthServerOptions.AccessTokenFormat, ticket);

            string strToken = context.SerializeTicket();

            using (AuthRepository _repo = new AuthRepository())
            {
                // retrieve client from database
                var client = _repo.FindClient(model.ClientId);
                // only generate refresh token if client is registered
                if (client != null)
                {
                    var contextRefresh = new Microsoft.Owin.Security.Infrastructure.AuthenticationTokenCreateContext(
                        Request.GetOwinContext(),
                        Startup.OAuthServerOptions.RefreshTokenFormat, ticket);

                    // Set this two context parameters or it won't work!!
                    contextRefresh.OwinContext.Set("as:clientAllowedOrigin", client.AllowedOrigin);
                    contextRefresh.OwinContext.Set("as:clientRefreshTokenLifeTime", client.RefreshTokenLifeTime.ToString());

                    // Generate the refresh toke
                    await Startup.OAuthServerOptions.RefreshTokenProvider.CreateAsync(contextRefresh);

                    return Json(new { access_token = strToken, userName = authenticatedUserName, refresh_token = contextRefresh.Token, useRefreshTokens = true });
                }
            }

            return Json(new { access_token = strToken, userName = authenticatedUserName, refresh_token = "", useRefreshTokens = false });
        }
    }
}