using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebApplication1.Models;
using Microsoft.Extensions.Configuration;

[Route("api/[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly string _connectionString;

    public OrdersController(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    [HttpPost]
    public async Task<IActionResult> PostOrder([FromBody] Order order)
    {
        // Validate that there are exactly three order details
        if (order.OrderDetails == null || order.OrderDetails.Count != 3)
        {
            return BadRequest("Each order must have exactly three order details.");
        }

        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            await connection.OpenAsync();

            using (SqlCommand command = new SqlCommand("AddOrderWithDetails", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add(new SqlParameter("@OrderDate", order.OrderDate));
                command.Parameters.Add(new SqlParameter("@CustomerName", order.CustomerName));
                command.Parameters.Add(new SqlParameter("@TotalAmount", order.TotalAmount));

                DataTable orderDetailsTable = new DataTable();
                orderDetailsTable.Columns.Add("ProductName", typeof(string));
                orderDetailsTable.Columns.Add("Quantity", typeof(int));
                orderDetailsTable.Columns.Add("UnitPrice", typeof(decimal));

                foreach (var detail in order.OrderDetails)
                {
                    orderDetailsTable.Rows.Add(detail.ProductName, detail.Quantity, detail.UnitPrice);
                }

                SqlParameter detailsParam = command.Parameters.AddWithValue("@OrderDetails", orderDetailsTable);
                detailsParam.SqlDbType = SqlDbType.Structured;
                detailsParam.TypeName = "dbo.OrderDetailsType";

                await command.ExecuteNonQueryAsync();
            }
        }

        return Ok();
    }
}
