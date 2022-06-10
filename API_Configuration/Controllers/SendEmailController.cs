using API_Configuration.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Resources;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API_Configuration.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SendEmailController : ControllerBase
    {
        private readonly ConfigurationContext _context;

        public SendEmailController(ConfigurationContext context)
        {
            _context = context;
        }
        // POST api/<SendEmailController>
        [HttpPost]
        public async Task<ActionResult> PostAsync([FromBody] EmailParams p)
        {
            await _context.Database.ExecuteSqlRawAsync(@"EXEC msdb.dbo.sp_send_dbmail @profile_name='Mail DB',
                                                        @recipients = {0},
                                                        @copy_recipients = {1},
		                                                @subject = {2},  
		                                                @body = {3}, @body_format = 'HTML'",p.To, p.Copy ?? "", p.Subject, p.HtmlBodyMail);
            return NoContent();
        }
        public record EmailParamsData()
        {
            public string? Key { get; set; }
            public string? Value { get; set; }
        }

        public record EmailParams() {
            [Required]
            public string? To { get; set; }
            public string? Copy { get; set; }
            [Required]
            public string? Subject { get; set; }
            [Required]
            public string? Title { get; set; }

            public string? Subtitle { get; set; }
            [Required]
            public string? Message { get; set; }
            [Required]
            public int Template { get; set; }

            public string? Attached { get; set; }
            [Required]
            public List<EmailParamsData>? Data { get; set; }
            [Required]
            public string? HtmlBodyMail => BuildMailHtmlFormat(Title, Subtitle, Message, Template, Data);
            private string? BuildMailHtmlFormat(string title, string subtitle, string msg, int template, List<EmailParamsData> data)
            {
                var assy = System.Reflection.Assembly.GetExecutingAssembly();
                ResourceManager resTemplate = new ResourceManager("API_Configuration.Templates.EmailTemplates", assy);
                var result = resTemplate.GetObject($"EmailTemplate{template}").ToString();
                result = result.Replace("XXX_TITULO_XXX", title);
                result = result.Replace("XXX_SUBTITULO_XXX", subtitle ?? "");
                result = result.Replace("XXX_MENSAJE_XXX", msg);
                var tempBody = "";

                data.ForEach(d =>
                {
                    tempBody +=
                    $@"<div style='background-color:transparent;'>
                        <div class='block-grid mixed-two-up' style='min-width: 320px; max-width: 750px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #FFFFFF;'>
                            <div style='border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;'>
                                <!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:transparent;'><tr><td align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:750px'><tr class='layout-full-width' style='background-color:#FFFFFF'><![endif]-->
                                <!--[if (mso)|(IE)]><td align='center' width='500' style='background-color:#FFFFFF;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px;'><![endif]-->
                                <div class='col num6' style='display: table-cell; vertical-align: top; max-width: 320px; min-width: 372px; width: 375px;'>
                                    <div class='col_cont' style='width:100% !important;'>
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style='border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;'>
                                            <!--<![endif]-->
                                            <!--[if mso]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif'><![endif]-->
                                            <div style='color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;'>
                                                <div style='font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;'>
                                                    <p style='font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;'><span style='color: #000000; font-size: 14px;'><a href='javascript:void(0)' style='text-decoration: none; color: #000000;' target='_blank'>{d.Key}</a></span></p>
                                                </div>
                                            </div>
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td><td align='center' width='250' style='background-color:#FFFFFF;width:250px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px;'><![endif]-->
                                <div class='col num6' style='display: table-cell; vertical-align: top; max-width: 320px; min-width: 372px; width: 375px;'>
                                    <div class='col_cont' style='width:100% !important;'>
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style='border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;'>
                                            <!--<![endif]-->
                                            <!--[if mso]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif'><![endif]-->
                                            <div style='color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;'>
                                                <div style='font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;'>
                                                    <p style='font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;'>{d.Value}</p>
                                                </div>
                                            </div>
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                     </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>";
                });
                result = result.Replace("XXX_CONTENIDO_XXX", tempBody);
                return result;
            }
        }
    }
}
