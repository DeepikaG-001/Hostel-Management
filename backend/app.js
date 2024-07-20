const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

app.post(
  "/upload",
  upload.fields([{ name: "groupFile" }, { name: "hostelFile" }]),
  (req, res) => {
    const groupFilePath = req.files["groupFile"][0].path;
    const hostelFilePath = req.files["hostelFile"][0].path;

    let groups = [];
    let hostels = [];

    fs.createReadStream(groupFilePath)
      .pipe(csv())
      .on("data", (data) => groups.push(data))
      .on("end", () => {
        fs.createReadStream(hostelFilePath)
          .pipe(csv())
          .on("data", (data) => hostels.push(data))
          .on("end", () => {
            const allocations = allocateRooms(groups, hostels);

            // Save allocations to CSV
            const csvFields = [
              "Group ID",
              "Hostel Name",
              "Room Number",
              "Members Allocated",
            ];
            const json2csvParser = new Parser({ csvFields });
            const csvData = json2csvParser.parse(allocations);

            const outputPath = path.join(
              __dirname,
              "uploads",
              "allocations.csv"
            );
            fs.writeFileSync(outputPath, csvData);

            res.json({ allocations, downloadUrl: "/uploads/allocations.csv" });
          });
      });
  }
);

function allocateRooms(groups, hostels) {
  groups = groups.map((group) => ({
    ...group,
    Members: parseInt(group.members, 10),
    Gender: group.gender,
  }));

  hostels = hostels.map((hostel) => ({
    ...hostel,
    Capacity: parseInt(hostel.capacity, 10),
    Gender: hostel.gender,
  }));

  let allocations = [];

  groups.forEach((group) => {
    const suitableHostels = hostels.filter((hostel) => {
      if (!hostel.Gender || !hostel.Capacity || !group.Gender) {
        return false;
      }

      if (
        group.Gender.toLowerCase().includes("boys") &&
        group.Gender.toLowerCase().includes("girls")
      ) {
        return false;
      }

      return (
        hostel.Gender.toLowerCase() === group.Gender.toLowerCase() &&
        hostel.Capacity >= group.Members
      );
    });

    if (suitableHostels.length > 0) {
      suitableHostels.sort((a, b) => a.Capacity - b.Capacity);
      const chosenHostel = suitableHostels[0];

      allocations.push({
        "Group ID": group.groupID,
        "Hostel Name": chosenHostel.hostelName,
        "Room Number": chosenHostel.roomNumber,
        "Members Allocated": group.Members,
      });

      chosenHostel.Capacity -= group.Members;
    }
  });

  return allocations;
}

app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  res.download(filePath);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
