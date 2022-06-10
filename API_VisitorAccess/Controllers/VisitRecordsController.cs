using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_VisitorAccess.Data;
using API_VisitorAccess.Models;
using System.ComponentModel.DataAnnotations;
using RestSharp;
using Newtonsoft.Json;

namespace API_VisitorAccess.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitRecordsController : ControllerBase
    {
        private readonly API_VisitorAccessContext _context;
        private readonly IConfiguration _config;

        public VisitRecordsController(API_VisitorAccessContext context, IConfiguration iconfig)
        {
            _context = context;
            _config = iconfig;
        }

        // GET: api/VisitRecords
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VisitRecord>>> GetVisitRecord()
        {
            return await _context.VisitRecord.ToListAsync();
        }
        // GET: api/VisitRecords/schedule
        [HttpGet("Schedule")]
        public async Task<ActionResult<IEnumerable<VisitRecordSchedule>>> GetVisitRecordSchedule([FromQuery] int? contact, DateTime? fechaIni, DateTime? fechaFin, bool? isReviewedByIT, string? folio)
        {
            if (fechaIni == null || fechaFin == null) return ValidationProblem("Missing add date field");
            if (fechaIni > fechaFin) return ValidationProblem("The start date must be less than the end date");

            var searchVisitRecords = await _context.VisitRecord
                                                    .Where(vr => (vr.Contact == contact || contact == null) && 
                                                                 (vr.RegistrationDate >= fechaIni && vr.RegistrationDate <= fechaFin) &&
                                                                 ((isReviewedByIT == true && vr.ITReviewer != null) || (isReviewedByIT == null)) &&
                                                                 (vr.Folio == folio || folio == null))
                                                    .Include(vr => vr.Visitor.Company)
                                                    .Include(vr => vr.SecurityBadge)
                                                    .Include(vr => vr.Document)
                                                    .Include(vr => vr.ContactEmployee)
                                                    .Include(vr => vr.VisitStatus)
                                                    .ToListAsync();

            var searchVisitRecordIds = searchVisitRecords.Select(vr => vr.VisitRecordId).ToList();
            var searchVisitorsIds = searchVisitRecords.Select(vr => vr.VisitorId).Distinct().ToList();
            var searchItReviewers = searchVisitRecords.Where(vr => vr.ITReviewer != null).Select(vr => vr.ITReviewer.Value).Distinct().ToList();
            var searchVisitRecordDevices = await _context.VisitRecordDevice.Where(vrd => searchVisitRecordIds.Contains(vrd.VisitRecordId.Value)).ToListAsync();
            var searchVisitRecordSecCourses = await _context.SecurityCourseRecord.Where(scr => searchVisitorsIds.Contains(scr.VisitorId.Value)).ToListAsync();
            var searchUsers = await _context.User.Where(u => searchItReviewers.Contains(u.UserId)).ToListAsync();

            var result = searchVisitRecords.Select(vr => new VisitRecordSchedule
            {
                VisitRecordId = vr.VisitRecordId,
                Folio = vr.Folio,
                VisitorId = vr.VisitorId.Value,
                VisitorFullName = $"{vr.Visitor.Name} {vr.Visitor.LastName}".Trim(),
                Company = vr.Visitor.Company.Description,
                SecurityBadge = (vr.SecurityBadge == null ? null : vr.SecurityBadge.Description),
                Document = (vr.Document == null ? null : vr.Document.Description),
                Contact = vr.Contact.Value,
                ContactFullName = $"{vr.ContactEmployee.Name} {vr.ContactEmployee.LastName}".Trim(),
                DeviceQty = searchVisitRecordDevices.Where(vrd => vrd.VisitRecordId == vr.VisitRecordId).Count(),
                VisitDate = vr.VisitDate.Value,
                HasCourse = (searchVisitRecordSecCourses.Where(src => src.VisitorId == vr.VisitorId.Value && src.ExpirationDate >= DateTime.Now.Date).Count() > 0),
                EntryDate = vr.EntryDate,
                DepartureDate = vr.DepartureDate,
                Status = vr.VisitStatus.Description,
                ITReviewer = vr.ITReviewer,
                ITReviewerFullName = (searchUsers.FirstOrDefault(su => su.UserId == vr.ITReviewer) == null ? null : 
                                     $"{searchUsers.First(su => su.UserId == vr.ITReviewer).Name} {searchUsers.First(su => su.UserId == vr.ITReviewer).LastName}".Trim())
            }).ToList();
            return result;
        }
        // GET: api/VisitRecords/schedule/folio
        [HttpGet("Schedule/{folio}")]
        public async Task<ActionResult<VisitRecordSchedule>> GetVisitRecordSchedule(string? folio)
        {
            var searchVisitRecord = await _context.VisitRecord
                                                    .Where(vr => (vr.Folio == folio || folio == null))
                                                    .Include(vr => vr.Visitor.Company)
                                                    .Include(vr => vr.SecurityBadge)
                                                    .Include(vr => vr.Document)
                                                    .Include(vr => vr.ContactEmployee)
                                                    .Include(vr => vr.VisitStatus)
                                                    .FirstOrDefaultAsync();
            
            if (searchVisitRecord == null) return NotFound();

            var searchVisitRecordDevices = await _context.VisitRecordDevice.Where(vrd => searchVisitRecord.VisitRecordId == vrd.VisitRecordId.Value).ToListAsync();
            var searchVisitRecordSecCourses = await _context.SecurityCourseRecord.Where(scr => searchVisitRecord.VisitorId == scr.VisitorId.Value).ToListAsync();
            var searchUser = await _context.User.FirstOrDefaultAsync(u => u.UserId == searchVisitRecord.ITReviewer);

            var result = new VisitRecordSchedule {
                VisitRecordId = searchVisitRecord.VisitRecordId,
                Folio = searchVisitRecord.Folio,
                VisitorId = searchVisitRecord.VisitorId.Value,
                VisitorFullName = $"{searchVisitRecord.Visitor.Name} {searchVisitRecord.Visitor.LastName}".Trim(),
                Company = searchVisitRecord.Visitor.Company.Description,
                SecurityBadge = (searchVisitRecord.SecurityBadge == null ? null : searchVisitRecord.SecurityBadge.Description),
                Document = (searchVisitRecord.Document == null ? null : searchVisitRecord.Document.Description),
                Contact = searchVisitRecord.Contact.Value,
                ContactFullName = $"{searchVisitRecord.ContactEmployee.Name} {searchVisitRecord.ContactEmployee.LastName}".Trim(),
                DeviceQty = searchVisitRecordDevices.Count(),
                VisitDate = searchVisitRecord.VisitDate.Value,
                HasCourse = (searchVisitRecordSecCourses.Where(src => src.ExpirationDate >= DateTime.Now.Date).Count() > 0),
                EntryDate = searchVisitRecord.EntryDate,
                DepartureDate = searchVisitRecord.DepartureDate,
                Status = searchVisitRecord.VisitStatus.Description,
                ITReviewer = searchVisitRecord.ITReviewer,
                ITReviewerFullName = (searchUser == null ? null : $"{searchUser.Name} {searchUser.LastName}".Trim())
            };
            return result;
        }

        public record VisitRecordSchedule()
        {
            public int VisitRecordId { get; set; }
            public string? Folio { get; set; }
            public string? VisitorFullName { get; set; }
            public int VisitorId { get; set; }
            public string? Company { get; set; }
            public string? SecurityBadge { get; set; }
            public string? Document { get; set; }
            public string? ContactFullName { get; set; }
            public int Contact { get; set; }
            public int DeviceQty { get; set; }
            public DateTime VisitDate { get; set; }
            public bool HasCourse { get; set; }
            public DateTime? EntryDate { get; set; }
            public DateTime? DepartureDate { get; set; }
            public string? Status { get; set; }
            public string? ITReviewerFullName { get; set; }
            public int? ITReviewer { get; set; }
        }

        // GET: api/VisitRecords/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VisitRecord>> GetVisitRecord(int id)
        {
            var visitRecord = await _context.VisitRecord.Where(vr => vr.VisitRecordId == id).Include(vr => vr.Devices).ThenInclude(d => d.DeviceType).FirstOrDefaultAsync();

            if (visitRecord == null)
            {
                return NotFound();
            }

            return visitRecord;
        }

        // PUT: api/VisitRecords/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVisitRecord(int id, VisitRecord visitRecord)
        {
            if (id != visitRecord.VisitRecordId) return BadRequest();

            if (visitRecord.EntryDate != null && visitRecord.DepartureDate == null)
                visitRecord.VisitStatusId = 2; //Inside

            if (visitRecord.EntryDate != null && visitRecord.DepartureDate != null)
                visitRecord.VisitStatusId = 3; //Outside

            _context.Entry(visitRecord).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                //SEND EMAIL TO CONTACT
                if (visitRecord.VisitStatusId == 2)
                {
                    var tempContact = await _context.User.FirstAsync(e => e.UserId == visitRecord.Contact);
                    var tempVisitor = await _context.Visitor.Where(e => e.VisitorId == visitRecord.VisitorId).Include(v=>v.Company).FirstAsync();
                    var tempdevices = await _context.VisitRecordDevice.Where(e => e.VisitRecordId == visitRecord.VisitRecordId).ToListAsync();
                    var client = new RestClient(_config.GetValue<string>("MailSetup:request"));
                    client.Timeout = -1;
                    var request = new RestRequest(Method.POST);
                    request.AddHeader("Content-Type", "application/json");
                    var bodyMail = new {
                                    template = 1,
                                    to = tempContact.Email,
                                    copy = _config.GetValue<string>("MailSetup:copyMail"),
                                    subject = "VISIT ACCESS",
                                    title = "AVISO",
                                    subtitle = "",
                                    message = $"Hola, ha llegado una visita",
                                    data = new [] {
                                            new {
                                                key = "FOLIO",
                                                value = visitRecord.Folio
                                            },
                                            new {
                                                key = "ENTRADA",
                                                value = (visitRecord.EntryDate != null ? visitRecord.EntryDate.Value.ToString("dd MMMM yyyy, hh:mm tt") : null)
                                            },
                                            new {
                                                key = "EMPRESA",
                                                value = (tempVisitor.Company != null ? tempVisitor.Company.Description : null)
                                            },
                                            new {
                                                key = "VISITANTE",
                                                value = tempVisitor != null ? ($"{tempVisitor.Name} {tempVisitor.LastName}") : null
                                            }
                                    }
                                };
                    request.AddParameter("application/json", JsonConvert.SerializeObject(bodyMail), ParameterType.RequestBody);
                    IRestResponse response = await client.ExecuteAsync(request);

                    if(tempdevices.Count() > 0)
                    {
                        request.Parameters.Clear();
                        var bodyMail2 = new
                        {
                            template = 1,
                            to = _config.GetValue<string>("MailSetup:ITCheckMail"),
                            copy = _config.GetValue<string>("MailSetup:copyMail"),
                            subject = "VISIT ACCESS - IT REVIEW",
                            title = "Review of IT Devices",
                            subtitle = "",
                            message = $"Hello, you have entered one or more devices on the floor, please review them",
                            data = new[] {
                                    new {
                                        key = "Folio",
                                        value = visitRecord.Folio
                                    },
                                    new {
                                        key = "Devices to check",
                                        value = tempdevices.Count().ToString() ?? null
                                    },
                                    new {
                                        key = "Contact",
                                        value = (tempContact != null ? ($"{tempContact.Name} {tempContact.LastName}") : null)
                                    },
                                    new {
                                        key = "Company",
                                        value = (tempVisitor.Company != null ? tempVisitor.Company.Description : null)
                                    },
                                    new {
                                        key = "Visitor",
                                        value = (tempVisitor != null ? ($"{tempVisitor.Name} {tempVisitor.LastName}") : null)
                                    },
                                    new {
                                        key = "IT Review",
                                        value = $"<a href='{_config.GetValue<string>("ITReview:request")}'>Clic here to view</a>"
                                    }
                            }
                        };
                        request.AddParameter("application/json", JsonConvert.SerializeObject(bodyMail2), ParameterType.RequestBody);
                        IRestResponse response2 = await client.ExecuteAsync(request);
                    }
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VisitRecordExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        
        // PUT: api/VisitRecords/AssignSecBadge
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("AssignSecBadge")]
        public async Task<IActionResult> PutVisitRecordAssignSecBadge(VisitRecordAssignSecBadge visitRecordAssignSecBadge)
        {
            if (!VisitRecordExists(visitRecordAssignSecBadge.VisitRecordId)) return NotFound();

            try
            {
                var temp = await _context.VisitRecord.FirstOrDefaultAsync(vr => vr.VisitRecordId == visitRecordAssignSecBadge.VisitRecordId);
                temp.DocumentId = visitRecordAssignSecBadge.DocumentId;
                temp.SecurityBadgeId = visitRecordAssignSecBadge.SecurityBadgeId;
                _context.VisitRecord.Update(temp);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }
        public record VisitRecordAssignSecBadge()
        {
            [Required]
            public int VisitRecordId { get; set; }
            [Required]
            public int DocumentId { get; set; }
            [Required]
            public int SecurityBadgeId { get; set; }
        }

        // PUT: api/VisitRecords/AssignDeviceIT
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("AssignDeviceIT")]
        public async Task<IActionResult> PutVisitRecordAssignDeviceIT(List<VisitRecordAssignDeviceIT> lstVisitRecordAssignDeviceIT)
        {
            if (lstVisitRecordAssignDeviceIT.Count() == 0) return NotFound();
            
            try
            {
                var tempDevices = await _context.VisitRecordDevice.Where(vrd => vrd.VisitRecordId == lstVisitRecordAssignDeviceIT[0].VisitRecordId).ToListAsync();
                if(tempDevices.Count() > 0)
                {
                    _context.VisitRecordDevice.RemoveRange(tempDevices);
                    await _context.SaveChangesAsync();
                }
                    
                
                lstVisitRecordAssignDeviceIT.ForEach(device =>
                {
                    _context.VisitRecordDevice.Add(new VisitRecordDevice
                    {
                        VisitRecordId = device.VisitRecordId,
                        DeviceTypeId = device.DeviceTypeId,
                        Brand = device.Brand,
                        Serial = device.Serial
                    });
                });

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }
        public record VisitRecordAssignDeviceIT()
        {
            [Required]
            public int VisitRecordId { get; set; }
            [Required]
            public int DeviceTypeId { get; set; }
            [Required]
            public string? Brand { get; set; }
            [Required]
            public string? Serial { get; set; }
        }
        
        // PUT: api/VisitRecords/DeviceIT
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("DeviceIT")]
        public async Task<IActionResult> PutVisitRecordDeviceIT(List<VisitRecordDevice> lstVisitRecordDeviceIT, [FromQuery] int? ITReviewer)
        {
            if (lstVisitRecordDeviceIT.Count() == 0) return NotFound();
            if (ITReviewer == null) return NotFound();
            try
            {
                lstVisitRecordDeviceIT.ForEach(device => { device.DeviceType = null; device.VisitRecord = null; });
                _context.VisitRecordDevice.UpdateRange(lstVisitRecordDeviceIT);

                var tempVisitRecord = await _context.VisitRecord.FirstOrDefaultAsync(vr => vr.VisitRecordId == lstVisitRecordDeviceIT[0].VisitRecordId);
                if (tempVisitRecord == null) return NotFound();
                tempVisitRecord.ITReviewer = ITReviewer;

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }


        // POST: api/VisitRecords
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<VisitRecord>> PostVisitRecord(CreateVisitRecord createVisitRecord)
        {
            var searchVisit = await _context.Visitor.FirstOrDefaultAsync(x => x.Name == createVisitRecord.Name && x.LastName == createVisitRecord.LastName && 
                                                                        x.Email == createVisitRecord.Email && x.CompanyId == createVisitRecord.CompanyId &&
                                                                        x.VisitorTypeId == createVisitRecord.VisitorTypeId);
            if (searchVisit == null) {
                searchVisit = new Visitor
                {
                    Name = createVisitRecord.Name,
                    LastName = createVisitRecord.LastName,
                    MotherLastName = createVisitRecord.MotherLastName,
                    Email = createVisitRecord.Email,
                    CompanyId = createVisitRecord.CompanyId,
                    VisitorTypeId = createVisitRecord.VisitorTypeId
                };
                _context.Visitor.Add(searchVisit);
                await _context.SaveChangesAsync();
            }

            var courseVisit = await _context.SecurityCourseRecord.AsNoTracking().FirstOrDefaultAsync(s => s.VisitorId == searchVisit.VisitorId && s.ExpirationDate < DateTime.Now.Date);

            int qtyVisitsByMonth = 0;
            for (int i = 0; i < createVisitRecord.QtyDays; i++)
            {
                //qtyVisitsByMonth = 
                var visitsByMonth = await _context.VisitRecord.AsNoTracking().Where(vr => vr.RegistrationDate.Value.Month == DateTime.Now.Month).ToListAsync();
                qtyVisitsByMonth = visitsByMonth.Count() > 0 ? visitsByMonth.Select(vr => {
                                                                    var result = vr.Folio.Split("-");
                                                                    var numero = int.Parse(result.Last());
                                                                    return numero;
                                                                }).Max() : 0;
                                                       ;
                _context.VisitRecord.Add(new VisitRecord
                {
                    Folio = $"{DateTime.Now.Year.ToString().Substring(2, 2)}{DateTime.Now.Month.ToString("d2")}-{qtyVisitsByMonth + 1}",
                    Contact = createVisitRecord.Contact,
                    RegistrationDate = DateTime.Now,
                    VisitDate = createVisitRecord.VisitDate.AddDays(i),
                    VisitStatusId = 1, //agendada
                    VisitorId = searchVisit.VisitorId,
                });
                await _context.SaveChangesAsync(); 
            }

            //SEND EMAIL SECURITY COURSE
            //if(searchVisit.Email.ToLower().Contains("@magna.com") && courseVisit == null && createVisitRecord.QtyDays > 0)
            //{
            //    var tempContact = await _context.User.FirstOrDefaultAsync(e => e.UserId == createVisitRecord.Contact);
            //    var client = new RestClient(_config.GetValue<string>("MailSetup:request"));
            //    client.Timeout = -1;
            //    var request = new RestRequest(Method.POST);
            //    request.AddHeader("Content-Type", "application/json");
            //    var bodyMail =
            //        new
            //        {
            //            template = 1,
            //            to = searchVisit.Email,
            //            copy = tempContact.Email,
            //            subject = "Nueva vista / New visit",
            //            title = "VISITA REGISTRADA / REGISTERED VISIT",
            //            subtitle = "",
            //            message = "Hola, te han registrado una visita / Hello, you have been registered to a visit",
            //            data = new[] {
            //                        new {
            //                            key = "FECHA / DATE",
            //                            value = DateTime.Now.ToString("dd MMMM yyyy")
            //                        },
            //                        new {
            //                            key = "FECHA DE VISITA / VISIT DATE",
            //                            value = createVisitRecord.VisitDate.ToString("dd MMMM yyyy, hh:mm tt")
            //                        },
            //                        new {
            //                            key = "CONTACTO / CONTACT",
            //                            value = $"{tempContact.Name} {tempContact.LastName}"
            //                        },
            //                        new {
            //                            key = "CURSO EHS (Requerido) / COURSE EHS (Required)",
            //                            value = $"<a href='{_config.GetValue<string>("SecurityCourse:request")}'>Clic aqui para ver / Clic here to view</a>"
            //                        }
            //            }
            //        };
            //    request.AddParameter("application/json", JsonConvert.SerializeObject(bodyMail), ParameterType.RequestBody);
            //    IRestResponse response = client.Execute(request);
            //}

            return Ok();
        }

        public record CreateVisitRecord()
        {
            [Required]
            public string? Name { get; set; }
            [Required]
            public string? LastName { get; set; }
            public string? MotherLastName { get; set; }
            [Required]
            public string? Email { get; set; }
            [Required]
            public int CompanyId { get; set; }
            [Required]
            public int VisitorTypeId { get; set; }
            [Required]
            public DateTime VisitDate { get; set; }
            [Required]
            public int Contact { get; set; }
            [Required]
            public int QtyDays { get; set; }
        }

        // DELETE: api/VisitRecords/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVisitRecord(int id)
        {
            var visitRecord = await _context.VisitRecord.FindAsync(id);
            if (visitRecord == null)
            {
                return NotFound();
            }

            _context.VisitRecord.Remove(visitRecord);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VisitRecordExists(int id)
        {
            return _context.VisitRecord.Any(e => e.VisitRecordId == id);
        }
    }
}
