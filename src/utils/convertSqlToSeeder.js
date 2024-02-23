export function convertSqlToSeeder(sqlStatements) {
   const tables = {};

   // Agrupar las sentencias SQL por tabla
   sqlStatements.forEach((statement) => {
      const tableName = statement.match(/INSERT INTO (\w+)/)[1];
      if (!tables[tableName]) {
         tables[tableName] = [];
      }
      tables[tableName].push(statement);
   });

   // Convertir las sentencias SQL en código de seeder de Laravel
   let seederCode = "";
   for (const [tableName, statements] of Object.entries(tables)) {
      seederCode += `DB::table('${tableName}')->insert([\n`;
      statements.forEach((statement) => {
         // console.log("statement", statement);
         const keys = statement
            .match(/\((.*?)\)/)[1]
            .split(",")
            .map((v) => v.trim());
         const values = statement
            .match(/VALUES \((.*?)\)/)[1]
            .split(",")
            .map((v) => v.trim()); //split("VALUES ("));
         // console.log("keys", keys);
         // console.log("values", values);
         // const formattedValues = keys.map((k,i) => (isNaN(k) ? `'${k}'` : k)).join(", ");
         const formattedValues = keys.map((k, i) => `'${k}' => ${values[i]}`).join(", ");
         // console.log("formattedValues", formattedValues);
         seederCode += `    [${formattedValues}],\n`;
      });
      seederCode += `]);\n\n`;
   }

   return seederCode;
}

// Ejemplo de uso
// const sqlStatements = [
//    "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0100B', 'INSTITUTO 18 DE MARZO A', 'AV. RAYÓN 101 SUR', 120, '7141143', 1, 'JOSÉ EDUARDO ESCOBEDO ESPINOZA', 'U');",
//    "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0091K', 'FRANCISCO ZARCO', 'AV. ALLENDE 262 NTE', 120, '8717147653', 1, 'PABLO OCHOA NÚÑEZ', 'U');",
//    "INSERT INTO students (name, age, grade) VALUES ('John Doe', 18, 'A');",
//    "INSERT INTO students (name, age, grade) VALUES ('Jane Doe', 17, 'B');"
// ];

// const seederCode = convertSqlToSeeder(sqlStatements);
// console.log(seederCode);
