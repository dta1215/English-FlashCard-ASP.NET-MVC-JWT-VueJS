using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Jwt;
using Owin;
using System;

[assembly: OwinStartup(typeof(vueWithJWT.Startup))]

namespace vueWithJWT
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            ConfigJWT(app);
        }
        public void ConfigJWT(IAppBuilder app)
        {
            //var issuer = ConfigurationManager.AppSettings["Issuer"];
            //var audience = ConfigurationManager.AppSettings["Audience"];
            //var audienceSecret = TextEncodings.Base64Url.Decode(ConfigurationManager.AppSettings["issuer"]);

            var symmetricKey = Convert.FromBase64String("db3OIsj+BXE9NZDy0t8W3TcNekrF+2d/1sFnWG4HnV8TZY30iTOdtVWJG8abWvB1GlOgJuQZdcF2Luqm/hccMw==");

            app.UseJwtBearerAuthentication(new JwtBearerAuthenticationOptions
            {
                AuthenticationMode = AuthenticationMode.Active,
                TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,

                    IssuerSigningKey = new SymmetricSecurityKey(symmetricKey)
                }
            });
        }
    }
}
