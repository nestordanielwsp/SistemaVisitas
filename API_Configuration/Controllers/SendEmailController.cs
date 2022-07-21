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
            await _context.Database.ExecuteSqlRawAsync(@"EXEC msdb.dbo.sp_send_dbmail @profile_name='Email',
                                                        @recipients = {0},
                                                        @copy_recipients = {1},
		                                                @subject = {2},  
		                                                @body = {3}, @body_format = 'HTML'", p.To, p.Copy ?? "", p.Subject, p.HtmlBodyMail);
            return NoContent();
        } 
        [HttpPost("SendEmailValidate")]
        public async Task<ActionResult> SendEmailValidate([FromBody] EmailParams p)
        {

            string send = string.Format(@"EXEC msdb.dbo.sp_send_dbmail @profile_name='Email',
                                                        @recipients = {0},
                                                        @copy_recipients = {1},
		                                                @subject = {2},  
		                                                @body = {3}, @body_format = 'HTML'", "'" + p.To + "'", "'" + p.Copy + "'", "'" + p.Subject + "'", "''");

            await _context.Database.ExecuteSqlRawAsync(send);
            return Ok(send);
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

                result = RegresaTemplate(template);

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

            private string RegresaTemplate(int template)
            {
                var _template = "";
                _template = $@"<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional //EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:v='urn:schemas-microsoft-com:vml'>
<head>
    <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
    <meta content='text/html; charset=utf-8' http-equiv='Content-Type' />
    <meta content='width=device-width' name='viewport' />
    <!--[if !mso]><!-->
    <meta content='IE=edge' http-equiv='X-UA-Compatible' />
    <!--<![endif]-->
    <title></title>
    <!--[if !mso]><!-->
    <link href='https://fonts.googleapis.com/css?family=Lato' rel='stylesheet' type='text/css' />
    <!--<![endif]--> 
</head>
<body class='clean-body' style='margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;'>
    <!--[if IE]><div class='ie-browser'><![endif]-->
    <table bgcolor='#FFFFFF' cellpadding='0' cellspacing='0' class='nl-container' role='presentation' style='table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;' valign='top' width='100%'>
        <tbody>
            <tr style='vertical-align: top;' valign='top'>
                <td style='word-break: break-word; vertical-align: top;' valign='top'>
                    <!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td align='center' style='background-color:#FFFFFF'><![endif]-->
                    <div style='background-color:transparent;'>
                        <div class='block-grid' style='min-width: 320px; max-width: 750px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;'>
                            <div style='border-collapse: collapse;display: table;width: 100%;background-color:transparent;'>
                                <!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:transparent;'><tr><td align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:750px'><tr class='layout-full-width' style='background-color:transparent'><![endif]-->
                                <!--[if (mso)|(IE)]><td align='center' width='750' style='background-color:transparent;width:750px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;'><![endif]-->
                                <div class='col num12' style='min-width: 320px; max-width: 750px; display: table-cell; vertical-align: top; width: 750px;'>
                                    <div class='col_cont' style='width:100% !important;'>
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style='border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;'>
                                            <!--<![endif]-->
                                            <!--[if mso]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif'><![endif]-->
                                            <div style='color:#555555;font-family:'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;'>
                                                <div style='line-height: 1.2; font-size: 12px; font-family: 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #555555; mso-line-height-alt: 14px;'>
                                                    <p style='font-size: 46px; line-height: 1.2; font-weight:700; text-align: center; word-break: break-word; font-family: 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 55px; margin: 0;'><span style='font-size: 46px;'></span></p>
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
                    </div>
                    <div style='background-color:transparent;'>
                        <div class='block-grid no-stack' style='min-width: 320px; max-width: 750px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #000000;'>
                            <div style='border-collapse: collapse;display: table;width: 100%;background-color:#000000;'>
                                <!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:transparent;'><tr><td align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:750px'><tr class='layout-full-width' style='background-color:#000000'><![endif]-->
                                <!--[if (mso)|(IE)]><td align='center' width='750' style='background-color:#000000;width:750px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 00px; padding-left: 00px; padding-top:00px; padding-bottom:00px;'><![endif]-->
                                <div class='col num12' style='min-width: 320px; max-width: 750px; display: table-cell; vertical-align: top; width: 750px;'>
                                    <div class='col_cont' style='width:100% !important;'>
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style='border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:00px; padding-bottom:00px; padding-right: 00px; padding-left: 00px;'>
                                            <!--<![endif]-->
                                            <!--[if mso]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif'><![endif]-->
                                            <div style='color:#FFFFFF;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;'>
                                                <div style='font-size: 12px; line-height: 1.2; color: #FFFFFF; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;'>
                                                    <p style='font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;'><span style='font-size: 14px;' id='correo_tabla_titulo'>DETALLE</span></p>
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
                    </div>

                    <!--REGISTROS DINAMICOS-->
                    <div id='correo_tabla_datos'>
                        XXX_CONTENIDO_XXX
                    </div>

                    <!--FIN DE REGISTROS DINAMICOS-->

                    <div style='background-color:transparent;'>
                        <div class='block-grid' style='min-width: 320px; max-width: 750px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;'>
                            <div style='border-collapse: collapse;display: table;width: 100%;background-color:transparent;'>
                                <!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:transparent;'><tr><td align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:750px'><tr class='layout-full-width' style='background-color:transparent'><![endif]-->
                                <!--[if (mso)|(IE)]><td align='center' width='750' style='background-color:transparent;width:750px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;'><![endif]-->
                                <div class='col num12' style='min-width: 320px; max-width: 750px; display: table-cell; vertical-align: top; width: 750px;'>
                                    <div class='col_cont' style='width:100% !important;'>
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style='border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;'>
                                            <!--<![endif]-->
                                            <table border='0' cellpadding='0' cellspacing='0' class='divider' role='presentation' style='table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;' valign='top' width='100%'>
                                                <tbody>
                                                    <tr style='vertical-align: top;' valign='top'>
                                                        <td class='divider_inner' style='word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;' valign='top'>
                                                            <table align='center' border='0' cellpadding='0' cellspacing='0' class='divider_content' role='presentation' style='table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px dotted #CCCCCC; width: 100%;' valign='top' width='100%'>
                                                                <tbody>
                                                                    <tr style='vertical-align: top;' valign='top'>
                                                                        <td style='word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;' valign='top'><span></span></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div style='background-color:transparent;'>
                        <div class='block-grid' style='min-width: 320px; max-width: 750px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;'>
                            <div style='border-collapse: collapse;display: table;width: 100%;background-color:transparent;'>
                                <!--[if (mso)|(IE)]><table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:transparent;'><tr><td align='center'><table cellpadding='0' cellspacing='0' border='0' style='width:750px'><tr class='layout-full-width' style='background-color:transparent'><![endif]-->
                                <!--[if (mso)|(IE)]><td align='center' width='750' style='background-color:transparent;width:750px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;' valign='top'><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px;'><![endif]-->
                                <div class='col num12' style='min-width: 320px; max-width: 750px; display: table-cell; vertical-align: top; width: 750px;'>
                                    <div class='col_cont' style='width:100% !important;'>
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style='border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;'>
                                            <!--<![endif]-->
                                            <!--[if mso]><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif'><![endif]-->
                                            <div style='color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;'>
                                                <div style='font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 14px;'>
                                                    <p style='font-size: 12px; line-height: 1.2; text-align: center; word-break: break-word; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px; margin: 0;'><span style='font-size: 12px;'>Por favor, no responda a este mensaje, es un envío automático.</span><br /></p>
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
                    </div>
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                </td>
            </tr>
        </tbody>
    </table>
    <!--[if (IE)]></div><![endif]-->
</body>
</html>";
                return _template;
            }
        }
    }
}
