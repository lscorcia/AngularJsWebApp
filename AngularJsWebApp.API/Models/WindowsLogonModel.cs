using System.ComponentModel.DataAnnotations;

namespace AngularJsWebApp.API.Models
{
    public class WindowsLogonModel
    {
        [Required]
        public string AuthenticationType { get; set; }

        [Required]
        public string ClientId { get; set; }
    }
}