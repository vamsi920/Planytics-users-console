const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const todoRoutes = express.Router();

var neo4j = require('neo4j-driver')
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "todo"))
app.use(cors());
app.use(bodyParser.json());
todoRoutes.route('/').get(async function (req, res) {
    const session = driver.session();
    const result = await session.run(
        `
        MATCH (n:TODO) RETURN n
      `);
  
      res.send(result.records.map((record) => record.get("n")));
  
      await session.close();
});
todoRoutes.route('/add').post(async function(req, res) {
    todoTask = req.body.todo_description;
    const session = driver.session();
    const result = await session.run(
        `
        CREATE (n:TODO {todo: $todoTask}) RETURN n
      `,
      {todoTask}
      );
  
      res.send(result.records.map((record) => record.get("n")));
      await session.close();
});
todoRoutes.route('/addExcel').post(async function(req, res) {
    todoTask = req.body;
    console.log(todoTask)
    let Description = todoTask['Description']
    let ItemNo = todoTask['Item No']
    let GLCode = todoTask['G/L Code']
    let ItemType = todoTask['Item Type']
    let ItemDesignation = todoTask['Item Designation']
    let LowestUnitofMeasure = todoTask['Lowest Unit of Measure']
    let PackedunitofMeasure1 = todoTask['Packed unit of Measure 1']
    let NoofLowestUnitofMeasureforPacked1 = todoTask['No of Lowest Unit of Measure for Packed 1']
    let PackedUnitofmeasure2 = todoTask['Packed Unit of measure 2']
    let NoofPacked1UoMintoPacked2UoM = todoTask['No of Packed 1 UoM into Packed 2 UoM']
    let UnitCost = todoTask['Unit Cost']
    let Currency = todoTask['Currency']
    let Family = todoTask['Family']
    let Model = todoTask['Model']
    let LeadTime = todoTask['Lead Time']
    let LeadTimeUnitofMeasure = todoTask['Lead Time Unit of Measure']
    let Supplier = todoTask['Supplier']
    let SupplierCode = todoTask['Supplier Code']
    const session = driver.session();
    const result = await session.run(
        `
        CREATE (n:ITEM {Description: $Description}) 
        SET n.ItemNo = $ItemNo
        SET n.GLCode = $GLCode
        SET n.ItemType = $ItemType
        SET n.ItemDesignation = $ItemDesignation
        SET n.LowestUnitofMeasure = $LowestUnitofMeasure
        SET n.PackedunitofMeasure1 = $PackedunitofMeasure1
        SET n.NoofLowestUnitofMeasureforPacked1 = $NoofLowestUnitofMeasureforPacked1
        SET n.PackedUnitofmeasure2 = $PackedUnitofmeasure2
        SET n.NoofPacked1UoMintoPacked2UoM = $NoofPacked1UoMintoPacked2UoM
        SET n.UnitCost = $UnitCost
        SET n.Currency = $Currency
        SET n.Family = $Family
        SET n.Model = $Model
        SET n.LeadTime = $LeadTime
        SET n.LeadTimeUnitofMeasure = $LeadTimeUnitofMeasure
        SET n.Supplier = $Supplier
        SET n.SupplierCode = $SupplierCode
      `,
      { Description,
        ItemNo,
        GLCode,
        ItemType,
        ItemDesignation,
        LowestUnitofMeasure,
        PackedunitofMeasure1,
        NoofLowestUnitofMeasureforPacked1,
        PackedUnitofmeasure2,
        NoofPacked1UoMintoPacked2UoM,
        UnitCost,
        Currency,
        Family,
        Model,
        LeadTime,
        LeadTimeUnitofMeasure,
        Supplier,
        SupplierCode
}


      );
  
      res.send(result.records.map((record) => record.get("n")));
      await session.close();
});

todoRoutes.route('/addExcelWithRelations').post(async function(req, res) {
  const session = driver.session();
  let globalLevel = 0
  let parentNode = {}
  todoTask = req.body.jsonOfExcel;
  for (var i = 0; i <todoTask.length; i++){ 
    var keys = {};
    for (var k in todoTask[i]){ keys[k.split(" ").join("")] = todoTask[i][k]};
    console.log(keys)
    let Level = todoTask[i]['Level']
    if(Level!=='' && Level!==' ')
    {
      if(Level==0)
    {
      await session.run(
      `
      CREATE (n:ITEM {Description: $Description}) 
      SET n.ItemNo = $ItemNo
      SET n.Level = $Level
      SET n.Quantity = $Quantity
      SET n.UoM = $UoM
      SET n.Model = $Model
      SET n.Family = $Family
    `,
    keys
    );}
    else{
      let diff = Level - globalLevel;
      if(Level!=globalLevel && diff==1){
        parentNode[Level] = todoTask[i-1]['Item No'];
        keys['parentItemNo'] = parentNode[Level]
        globalLevel = Level;
        await session.run(
          `
          CREATE (n:ITEM {Description: $Description}) 
          SET n.ItemNo = $ItemNo
          SET n.Level = $Level
          SET n.Quantity = $Quantity
          SET n.UoM = $UoM
          SET n.Model = $Model
          SET n.Family = $Family
          WITH n
          MATCH (m:ITEM {ItemNo:$parentItemNo })
          CREATE (m)-[:HAS_PART_OF {Quantity: $Quantity}]->(n)
        `,
        keys
        )
      }
      else if(Level==globalLevel && diff==0){
        keys['parentItemNo'] = parentNode[Level]
        await session.run(
          `
          CREATE (n:ITEM {Description: $Description}) 
          SET n.ItemNo = $ItemNo
          SET n.Level = $Level
          SET n.Quantity = $Quantity
          SET n.UoM = $UoM
          SET n.Model = $Model
          SET n.Family = $Family
          WITH n
          MATCH (m:ITEM {ItemNo:$parentItemNo })
          CREATE (m)-[:HAS_PART_OF {Quantity: $Quantity}]->(n)
        `,
        keys
        )
      }
      else if(Level!==globalLevel && diff<0){
        keys['parentItemNo'] = parentNode[Level]
        globalLevel = Level;
        await session.run(
          `
          CREATE (n:ITEM {Description: $Description}) 
          SET n.ItemNo = $ItemNo
          SET n.Level = $Level
          SET n.Quantity = $Quantity
          SET n.UoM = $UoM
          SET n.Model = $Model
          SET n.Family = $Family
          WITH n
          MATCH (m:ITEM {ItemNo:$parentItemNo })
          CREATE (m)-[:HAS_PART_OF {Quantity: $Quantity}]->(n)
        `,
        keys
        )
      }
     
    }
  }
  }
  
  
    await session.close();
});
todoRoutes.route('/delete').post(async function(req, res) {

    console.log(req.body)
    let todo = req.body.taskId;
    const session = driver.session();
    const result = await session.run(
        `
        MATCH (n:TODO {todo: $todo}) DELETE n
      `,
      {todo}
      );
  
      res.send("successful");
      await session.close();
});
app.use('/todos', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
    
});