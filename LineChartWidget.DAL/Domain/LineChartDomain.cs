using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace LineChartWidget.DAL.Domain
{
    public class LineChartDomain
    {
        protected SqlConnection con;

        public LineChartDomain() 
        {
            con = GetConnection();
        }

        // _CONNECTION_OPEN
        public bool isOpen(string Connection = "DefaultConnection")
        {
            con = new SqlConnection(@WebConfigurationManager.ConnectionStrings[Connection].ToString());

            try
            {
                bool b = true;
                if (con.State.ToString() != "Open")
                {
                    con.Open();
                }
                return b;
            }
            catch (SqlException ex)
            {
                return false;
            }
        }

        // _CONNECTION_STRING
        public SqlConnection GetConnection()
        {
            return con;
        }

        // _CONNECTION_CLOSE
        public bool Close()
        {
            try
            {
                con.Close();
                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        // get all sales
        public SqlDataReader GetSales()
        {
            SqlCommand cmd = new SqlCommand("dbo.getSales", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@from_date", "NULL");
            cmd.Parameters.AddWithValue("@to_date", "NULL");
            
            var reader = cmd.ExecuteReader();

            return reader;

        }

        // get sales by date
        public SqlDataReader GetSalesByDate(string from_date, string to_date)
        {
            if (from_date != null && to_date != null)
            {
                from_date = from_date.Replace("\"", "");
                to_date = to_date.Replace("\"", "");
            }

            DateTime? _fromDate = string.IsNullOrEmpty(from_date) ?
                (DateTime?)null : Convert.ToDateTime(from_date);

            DateTime? _toDate = string.IsNullOrEmpty(to_date) ?
                (DateTime?)null : Convert.ToDateTime(to_date);

            SqlCommand cmd = new SqlCommand("dbo.getSales", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@from_date", _fromDate);
            cmd.Parameters.AddWithValue("@to_date", _toDate);
            var reader = cmd.ExecuteReader();

            return reader;

        }

    }
}