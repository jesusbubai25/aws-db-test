// 1. Obtain the list of power stations under the account

exports.userStationList = {
  body: {
    pageNo: 1,
    pageSize: 10,
    // nmiCode: "",
  },
  api: "/v1/api/userStationList",
};

// // 5. Obtain real-time data of a single inverter on a certain day

module.exports.inverterDay = {
  body: {
    id: "1308675217947274305",
    sn: "110311224010330",
    time: "2024-07-10",
  },
  api: "/v1/api/inverterDay",
};

// //   24. Obtaining real-time data of multiple power stations on a certain day

module.exports.stationDayEnergyList = {
  body: { id: "1298491919449094809", time: "2024-04-01" },
  api: "/v1/api/stationDayEnergyList",
};

// // 27. Obtain real-time data of a single power station on a certain day

module.exports.stationDay = {
  body: { id: "1298491919449094809", time: "2024-04-01" },
  api: "/v1/api/stationDay",
};
