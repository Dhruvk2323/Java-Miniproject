const fs = require('fs');
const path = require('path');

const docXmlPath = 'C:\\Users\\karan\\AppData\\Local\\Temp\\docx_extracted\\word\\document.xml';
let xml = fs.readFileSync(docXmlPath, 'utf8');

console.log('Original document.xml length:', xml.length);

// 1. Cover page student table
// Let's find the table following "Name of Student"
const studentTableTarget = /<w:tr w:rsidR="00A73BD6"><w:trPr><w:trHeight w:val="520"\/><\/w:trPr><w:tc><w:tcPr><w:tcW w:w="4306" w:type="dxa"\/>[\s\S]*?<\/w:tr><w:tr w:rsidR="00A73BD6"><w:trPr><w:trHeight w:val="520"\/><\/w:trPr><w:tc><w:tcPr><w:tcW w:w="4306" w:type="dxa"\/>[\s\S]*?<\/w:tr><w:tr w:rsidR="00A73BD6"><w:trPr><w:trHeight w:val="520"\/><\/w:trPr><w:tc><w:tcPr><w:tcW w:w="4306" w:type="dxa"\/>[\s\S]*?<\/w:tr>/;

const filledStudentRows = `
<w:tr w:rsidR="00A73BD6">
  <w:trPr><w:trHeight w:val="520"/></w:trPr>
  <w:tc>
    <w:tcPr><w:tcW w:w="4306" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:left w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:right w:val="single" w:sz="4" w:space="0" w:color="A1887F"/></w:tcBorders><w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>
    <w:p w:rsidR="00A73BD6" w:rsidRDefault="00A01B05"><w:r><w:rPr><w:b/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>Dhruv Karanje</w:t></w:r></w:p>
  </w:tc>
  <w:tc>
    <w:tcPr><w:tcW w:w="2000" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:left w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:right w:val="single" w:sz="4" w:space="0" w:color="A1887F"/></w:tcBorders><w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>
    <w:p w:rsidR="00A73BD6" w:rsidRDefault="00A01B05"><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>23</w:t></w:r></w:p>
  </w:tc>
  <w:tc>
    <w:tcPr><w:tcW w:w="2000" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:left w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:right w:val="single" w:sz="4" w:space="0" w:color="A1887F"/></w:tcBorders><w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>
    <w:p w:rsidR="00A73BD6" w:rsidRDefault="00A01B05"><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>SE Computer / Div A</w:t></w:r></w:p>
  </w:tc>
</w:tr>
<w:tr w:rsidR="00A73BD6">
  <w:trPr><w:trHeight w:val="520"/></w:trPr>
  <w:tc>
    <w:tcPr><w:tcW w:w="4306" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:left w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:right w:val="single" w:sz="4" w:space="0" w:color="A1887F"/></w:tcBorders><w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>
    <w:p w:rsidR="00A73BD6" w:rsidRDefault="00A01B05"><w:r><w:rPr><w:color w:val="666666"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>Student Team Member 2</w:t></w:r></w:p>
  </w:tc>
  <w:tc>
    <w:tcPr><w:tcW w:w="2000" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:left w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:right w:val="single" w:sz="4" w:space="0" w:color="A1887F"/></w:tcBorders><w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>
    <w:p w:rsidR="00A73BD6" w:rsidRDefault="00A01B05"><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="666666"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>[Roll No.]</w:t></w:r></w:p>
  </w:tc>
  <w:tc>
    <w:tcPr><w:tcW w:w="2000" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:left w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:right w:val="single" w:sz="4" w:space="0" w:color="A1887F"/></w:tcBorders><w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>
    <w:p w:rsidR="00A73BD6" w:rsidRDefault="00A01B05"><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="666666"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>SE Computer</w:t></w:r></w:p>
  </w:tc>
</w:tr>
<w:tr w:rsidR="00A73BD6">
  <w:trPr><w:trHeight w:val="520"/></w:trPr>
  <w:tc>
    <w:tcPr><w:tcW w:w="4306" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:left w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:right w:val="single" w:sz="4" w:space="0" w:color="A1887F"/></w:tcBorders><w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>
    <w:p w:rsidR="00A73BD6" w:rsidRDefault="00A01B05"><w:r><w:rPr><w:color w:val="666666"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>Student Team Member 3</w:t></w:r></w:p>
  </w:tc>
  <w:tc>
    <w:tcPr><w:tcW w:w="2000" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:left w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:right w:val="single" w:sz="4" w:space="0" w:color="A1887F"/></w:tcBorders><w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>
    <w:p w:rsidR="00A73BD6" w:rsidRDefault="00A01B05"><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="666666"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>[Roll No.]</w:t></w:r></w:p>
  </w:tc>
  <w:tc>
    <w:tcPr><w:tcW w:w="2000" w:type="dxa"/><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:left w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="A1887F"/><w:right w:val="single" w:sz="4" w:space="0" w:color="A1887F"/></w:tcBorders><w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar><w:vAlign w:val="center"/></w:tcPr>
    <w:p w:rsidR="00A73BD6" w:rsidRDefault="00A01B05"><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="666666"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>SE Computer</w:t></w:r></w:p>
  </w:tc>
</w:tr>`;

if (studentTableTarget.test(xml)) {
  xml = xml.replace(studentTableTarget, filledStudentRows.trim());
  console.log('Cover page student details replaced successfully.');
} else {
  console.warn('Could not match studentTableTarget!');
}

// 2. Guide Name
xml = xml.replace('<w:t>[Name of Guide]</w:t>', '<w:t>Prof. / Guide Name</w:t>');

// 3. Declaration signatures
xml = xml.replace('<w:t>Student 1</w:t>', '<w:t>Dhruv Karanje (Roll No. 23)</w:t>');
xml = xml.replace('<w:t>Student 2</w:t>', '<w:t>Student Team Member 2</w:t>');
xml = xml.replace('<w:t>Student 3</w:t>', '<w:t>Student Team Member 3</w:t>');

console.log('Signatures and Guide replaced.');
