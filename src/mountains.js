/**
 * Created by dmitrii on 11.9.18.
 */
var MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, country: "Tanzania"},
    {name: "Everest", height: 8848, country: "Nepal"},
    {name: "Mount Fuji", height: 3776, country: "Japan"},
    {name: "Mont Blanc", height: 4808, country: "Italy/France"},
    {name: "Vaalserberg", height: 323, country: "Netherlands"},
    {name: "Denali", height: 6168, country: "United States"},
    {name: "Popocatepetl", height: 5465, country: "Mexico"}
];

if (typeof module != "undefined" && module.exports)
    module.exports = MOUNTAINS;
function rowHeights(rows) {
    return rows.map(function (row) {
        return row.reduce(function (max,cell) {
            return Math.max(max,cell.minHeight());
        },0);
    });
}
function colWidths(rows) {
    return rows[0].map(function (_,i) {
        return rows.reduce(function (max,row) {
            return Math.max(max,row[i].minWidth);
        },0);
    });
}

function drawTable(rows) {
    var heights = rowHeights(rows);
    var widths = colWidths(rows);

    function drawLine(blocks, lineNo) {
        return blocks.map(function (block) {
            return block[lineNo];
        }).join("");
    }

    function drawRow(row, rowNum) {
        var blocks = row.map(function (cell, colNum) {
            return cell.draw(widths[colNum], heights[rowNum]);
        });
        return blocks[0].map(function (_, lineNo) {
            return drawLine(blocks, lineNo);
        }).join("\n");
    }

    return rows.map(drawRow).join("\n");
}
    function repeat(string,times){
        var result = "";
        for (let i = 0; i < times; i++)
            result += string;
        return result;
    }

    function  TextCell(text) {
        this.text = text.split("\n");
    }
    TextCell.prototype.minHeight = function () {
        return this.text.length;
    };
    TextCell.prototype.draw = function (width,height) {
        var result = [];
        for (let i = 0;i < height;i++){
            let line = this.text[i] ||  "";
            result.push(line + repeat("",width - line.length));
        }
        return result;
    };

    function UnderlineCell(inner) {
        this.inner = inner;
    }
    UnderlineCell.prototype.minWidth = function () {
        return this.inner.minWidth;
    };
    UnderlineCell.prototype.minHeight = function () {
        return this.inner.minHeight() + 1;
    };
    UnderlineCell.prototype.draw = function (width,height) {
        return this.inner.draw(width,height - 1).concat([repeat("-",width)]);
    };
    function dataTable(data) {
        var keys = Object.keys(data[0]);
        var headers = keys.map(function (name) {
            return new UnderlineCell(new TextCell(name));
        });
        var body = data.map(function (row) {
            return keys.map(function (name) {
                return new TextCell(String(row[name]));
            });
        });
        return [headers].concat(body);
    }

    console.log(drawTable(dataTable(MOUNTAINS)));

