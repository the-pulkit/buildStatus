const lib = require('lib')({token: process.env.STDLIB_LIBRARY_TOKEN});

module.exports = async () => {

  const data = await lib.airtable.query['@0.3.3'].select({
    table: "Brog",
    where: [{}],
    limit: {
      "count": 0,
      "offset": 0
    }
  }).then(r => { 
    return r.rows;
  });

  // Here I am trying to populate an object that can keep track of all logs associated with a particular URL
  // This sometimes works, and sometimes seems to timeout when running.
  let workflow = {};
  data.forEach(row => {
    let day = row.fields.TID.toString();
    let hour = row.fields.Hour;
    if(workflow[day]) {
      if(workflow[day][hour]) {
        workflow[day][hour].push(row.fields.Duration);
        if(workflow[day][hour].length === 6) {
          let total = workflow[day][hour].reduce((acc, cur) => {
            acc = acc + cur;
            return acc;
          }, 0);
        workflow[day][hour] = {
          latency: [Math.trunc((total / workflow[day][hour].length), 2)],
        };
        }
      } else {
        workflow[day][hour] = [row.fields.Duration];
      }
    } else {
        let n = {}
        workflow[day] = n;
        workflow[day][hour] = [row.fields.Duration];
    }
  });
  
    // Returns a number to indicate the uptime over the past week
    const uptime = data => {
      let u = data.reduce((acc, current) => {
        if(current.fields["Status Code"] === 200) {
          acc[0] = acc[0] + 1;
          return acc;
        }
        acc[1] = acc[1] + 1;
        return acc;
      }, [0, 0]);
    return Math.floor(u[0] / (u[0] + u[1]) * 100);
  };
  return [workflow, uptime(data)];
};