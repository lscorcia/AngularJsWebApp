using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;

namespace AngularJsWebApp.API.Authorization
{
    public class AuthContext : IdentityDbContext<IdentityUser>
    {
        public AuthContext()
            : base("AuthContext")
        {

        }
    }
}