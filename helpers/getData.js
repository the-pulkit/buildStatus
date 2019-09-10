const lib = require('lib')({token: process.env.STDLIB_LIBRARY_TOKEN});

module.exports = async (url) => {

  const data = await lib.airtable.query['@0.3.3'].select({
    table: "Brog",
    where: [{
    }],
    limit: {
      "count": 0,
      "offset": 0
    }
  }).then(r => { 
    return r.rows.map(n => { 
      return { 
        url: n.fields.URL[0],
        Duration: n.fields.Duration,
        Hour: n.fields.Hour,
        TID: n.fields.TID,
        Status: n.fields["Status Code"]
      } 
    }) 
  });

  // Here I am trying to populate an object that can keep track of all logs associated with a particular URL
  // This sometimes works, and sometimes seems to timeout when running.
  let workflow = {};
  data.forEach(row => {
    let day = row.TID.toString();
    let hour = row.Hour;
    if(row.url === url) {
      if(workflow[day]) {
        if(workflow[day][hour]) {
          workflow[day][hour].push(row.Duration);
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
          workflow[day][hour] = [row.Duration];
        }
      } else {
          let n = {}
          workflow[day] = n;
          workflow[day][hour] = [row.Duration];
      }
    }
  });
  
    // Returns a number to indicate the uptime over the past week
    const uptime = data => {
      let u = data.reduce((acc, current) => {
        if(current.Status === 200) {
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