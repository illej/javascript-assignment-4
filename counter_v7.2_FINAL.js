(function() {
    var app = angular.module('counter', []);

    app.controller('CountController', function($scope) {

        $scope.rawFiles = [];
        $scope.allMyFiles = [];
        $scope.superArray = [];

        $scope.fileLoader = function(evt) {
            var files = evt.target.files;
            $scope.rawFiles = files;

            for (var i = 0; i < files.length; i++) {
                $scope.fileReader(files[i], files);
            }
        };

        $scope.fileReader = function(file, files) {
            // var name = file.name;
            var reader = new FileReader();
            reader.onload = function(e) {
                var textInFile = e.target.result; // get file content
                $scope.allMyFiles.push(textInFile);
                if ($scope.allMyFiles.length === files.length) { // check if all files read
                    for (var i = 0; i < $scope.allMyFiles.length; i++) { // FOR EACH FILE..
                        var fileName = files[i].name;
                        if (fileName.match(/\.js/)) {
                            $scope.fileBuilder(fileName, $scope.allMyFiles[i]);
                        }
                    }
                }
            }
            reader.readAsText(file);
        };

        $scope.fileBuilder = function(fName, rawFile) {
            // strip comments & strings
            var cleanPhase1 = rawFile.replace(/(\/\/)(.*)/g, "");
            var cleanPhase2 = cleanPhase1.replace(/\/\*[\s\S]*?\*\//g, "");
            var cleanPhase3 = cleanPhase2.replace(/['"][\s\w-\\]*['"]/g, "");
            var cleanPhase4 = cleanPhase3.replace(/\/.+\//g, "");
            var cleanPhase5 = cleanPhase4.replace(/('.*".*".*')|(".*'.*'.*")/g);
            var cleanFile = cleanPhase5;
            // new Obj for each FILE passed in
            var fileObj = {};
            fileObj.fileName = fName;
            fileObj.lloc = $scope.llocCounter(cleanFile, "line");
            fileObj.allMyClasses = [];
            fileObj.classTotalLLOC;
            fileObj.classAvgLLOC;
            fileObj.classStdDevLLOC;
            fileObj.globalLLOC;

            // scan file for list of UNIQUE CLASSES
            var listOfClasses = $scope.doesEntityExist(cleanFile, "class"); // ["xfunc", "yfunc", etc..]
            if (listOfClasses != null) {
                for (var i = 0; i < listOfClasses.length; i++) {
                    var line = listOfClasses[i];
                    var matchedLine = line.match(/var\s(\w+)\s\=\sfunction/);
                    /* SCOPE */
                    var matchedLineScope = line.match(/(\$scope)\.(\w+)\s\=\sfunction/);

                    if (matchedLine) {
                        var className = matchedLine[1];
                        // build up array of CLASSES
                        fileObj.allMyClasses.push($scope.classBuilder(className, cleanFile));
                    } else if (matchedLineScope) {
                        var className = matchedLineScope[1];
                        // build up array of CLASSES
                        fileObj.allMyClasses.push($scope.classBuilder(className, cleanFile));
                    }
                }
            }

            fileObj.numberOfMethodsInFile = $scope.calcTheNumberOfMethodsInEachFile(fileObj.allMyClasses);
            fileObj.classTotalLLOC = $scope.calcSum(fileObj.allMyClasses);
            fileObj.totalMethodLLOCavg = $scope.calcAvg(fileObj.numberOfMethodsInFile, fileObj.classTotalLLOC);
            fileObj.classAvgLLOC = $scope.calcAvg(fileObj.allMyClasses.length, $scope.calcSum(fileObj.allMyClasses));
            fileObj.classStdDevLLOC = $scope.calcStdDev(fileObj.allMyClasses, $scope.calcSum(fileObj.allMyClasses));
            fileObj.globalLLOC = $scope.calcDiff(fileObj.lloc, fileObj.classTotalLLOC);

            $scope.$applyAsync($scope.superArray.push(fileObj));
            console.log($scope.superArray);
        };

        $scope.classBuilder = function(cName, file) {
            // new Obj for each CLASS passed in
            var classObj = {};
            classObj.className = cName;
            classObj.allMyMethods = [];
            classObj.lloc;
            classObj.methodAvgLLOC;
            classObj.methodStdDevLLOC;

            // scan file for list of UNIQUE METHODS
            var listOfMethods = $scope.doesEntityExist(file, "method");
            if (listOfMethods != null) {
                for (var i = 0; i < listOfMethods.length; i++) {
                    var line = listOfMethods[i];
                    var matchedLine = line.match(/\b(\w+)\.prototype\.(\w+)\s\=\s\bfunction/);
                    /* $SCOPE exception */
                    if (!matchedLine) {
                        var matchedLine = line.match(/(\$scope)\.(\w+)\s\=\sfunction/);
                    }
                    var parentName = matchedLine[1];
                    var methodName = matchedLine[2];
                    // build up array of METHODS
                    if (parentName == classObj.className) {
                        classObj.allMyMethods.push($scope.methodBuilder(methodName, file));
                    }
                }
            }
            classObj.lloc = $scope.TotalClassLLOC(classObj.allMyMethods);
            classObj.methodAvgLLOC = $scope.calcAvg(classObj.allMyMethods.length, $scope.calcSum(classObj.allMyMethods));
            classObj.methodStdDevLLOC = $scope.calcStdDev(classObj.allMyMethods, $scope.calcSum(classObj.allMyMethods));

            return classObj;
        };

        $scope.methodBuilder = function(mName, file) {
            // new Obj for each METHOD passed in
            var methodObj = {};
            methodObj.methodName = mName;
            methodObj.lloc = $scope.llocCounter($scope.blockMatcher(file, methodObj.methodName), "line");

            return methodObj;
        };

        $scope.blockMatcher = function(file, mName) {
            var arrayOfBlocks = $scope.stringSplitter(file, "block");
            for (var i = 0; i < arrayOfBlocks.length; i++) {
                var block = arrayOfBlocks[i];
                var blockMatch = block.match(/(\w+)\.(\w+)\s\=\s(\bfunction\b)/);

                if (blockMatch && (blockMatch[2] == mName)) {
                    return block;
                }
            }
        };

        // receives STRING and returns COUNT of each LINE in STRING
        $scope.llocCounter = function(string, delimiter) {
            var lineCount = 0;
            var array = $scope.stringSplitter(string, delimiter);

            for (var i = 0; i < array.length; i++) {
                var line = array[i];

                /* regEx list */
                var periods = line.match(/(\.)/g);
                var assignments = line.match(/(\=)/g);
                var ifs = line.match(/if\s\(/g);
                var elses = line.match(/else\s/g);

                var multiVars = line.match(/var\s(\w\S*)(\,.*)+/g);
                var vars = line.match(/var\s(\w+)/g);
                var forLoops = line.match(/for\s\(/g);
                var switches = line.match(/switch\s\(/g); /* CHECK IN REGEXER */
                var cases = line.match(/case\s/g); /* CHECK IN REGEXER */
                var breaks = line.match(/\bbreak\b\;/g); /* CHECK IN REGEXER */
                var news = line.match(/\s\=\snew\s(\w+)/g); /* CHECK IN REGEXER */
                var anonFunctions = line.match(/function\(/g);
                var returns = line.match(/return\s(\w+)/g);
                var ands = line.match(/\&{2}/g);
                var ors = line.match(/\|{2}/g);
                var comparisons = line.match(/\={2}/g);
                var absoluteComparisons = line.match(/\={3}/g);

                var operators = line.match(/[\+\-\*\/><]/g);

                if (periods) {
                    lineCount += periods.length;
                }
                if (ifs) {
                    lineCount += ifs.length;
                }
                if (elses) {
                    lineCount += elses.length;
                }
                if (multiVars) {
                    lineCount += multiVars.length * 2;
                } else if (vars) {
                    lineCount += vars.length;
                }
                if (forLoops) {
                    lineCount += forLoops.length;
                }
                if (switches) {
                    lineCount += switches.length;
                }
                if (cases) {
                    lineCount += cases.length;
                }
                if (breaks) {
                    lineCount += breaks.length;
                }
                if (news) {
                    lineCount += news.length;
                }
                if (anonFunctions) {
                    lineCount += anonFunctions.length;
                }
                if (returns) {
                    lineCount += returns.length;
                }
                if (ands) {
                    lineCount += ands.length;
                }
                if (ors) {
                    lineCount += ors.length;
                }
                if (absoluteComparisons) {
                    lineCount += absoluteComparisons.length;
                } else if (comparisons) {
                    lineCount += comparisons.length;
                } else if (assignments) {
                    lineCount += assignments.length;
                }
                if (operators) {
                    lineCount += operators.length;
                }
            }
            return lineCount;
        };

        // receives STRING and returns ARRAY of depending on the DELIMITER
        $scope.stringSplitter = function(string, delimSwitch) {
            var delimiter;
            if (delimSwitch == "block") {
                delimiter = /;(?:\r?\n){2,}(?:\/\*[\s\S]*?\*\/)*(?=[\s\S])/;
            } else if (delimSwitch == "line") {
                delimiter = /\r?\n/;
            }
            return string.split(delimiter);
        };

        // receives STRING and returns list of EVERY MATCH in STRING
        $scope.doesEntityExist = function(string, delimSwitch) {
            var array;
            if (delimSwitch == "class") {
                array = string.match(/var\s(\w+)\s\=\sfunction/g);
                // Check for $SCOPE
                if (!array) {
                    array = string.match(/(\$scope)\.(\w+)\s\=\sfunction/);
                }
            } else if (delimSwitch == "method") {
                array = string.match(/\b(\w+)\.prototype\.(\w+)\s\=\s\bfunction/g);
                if (!array) {
                    array = string.match(/(\$scope)\.(\w+)\s\=\sfunction/g);
                }
            } else {
                array = null;
            }
            return array;
        };

        /*-----------------------------
        	STATIISTICS CALCULATIONS
        ------------------------------*/
        $scope.calcDiff = function(fileTotal, classTotal) {
            var diff = fileTotal - classTotal;
            return diff;
        };

        $scope.calcTheNumberOfMethodsInEachFile = function(array) {
            var numOfMethods = 0;
            for (var i = 0; i < array.length; i++) {
                var cls = array[i];
                numOfMethods += cls.allMyMethods.length;
            }
            return numOfMethods;
        };

        $scope.calcTotalClasses = function(array) {
            var total = 0;
            for (var i = 0; i < array.length; i++) {
                file = array[i];
                total += file.allMyClasses.length;
            }
            return total;
        };

        $scope.calcTotalMethods = function(array) {
            var total = 0;
            for (var i = 0; i < array.length; i++) {
                file = array[i];
                for (var j = 0; j < file.allMyClasses.length; j++) {
                    cls = file.allMyClasses[j];
                    total += cls.allMyMethods.length;
                }
            }
            return total;
        };

        $scope.TotalClassLLOC = function(array) {
            var llocTotal = 0;
            // from CLASS.METHODS
            for (var i = 0; i < array.length; i++) {
                var method = array[i];
                llocTotal += method.lloc;
            }
            return llocTotal;
        };

        $scope.calcSum = function(array) {
            var sum = 0;
            for (var i = 0; i < array.length; i++) {
                sum += array[i].lloc;
            }
            return sum;
        };

        $scope.calcAvg = function(arrayLength, sum) {
            return sum / arrayLength;
        };

        $scope.calcStdDev = function(array, sum) {
            var stdDev = 0;
            if (array.length > 1) {
                stdDev = Math.sqrt(sum / (array.length - 1));
            } else {
                stdDev = "N/A";
            }
            return stdDev;
        };

        /*----------------------
        	SAVE TO TEXT FILE
        -----------------------*/
        $scope.downloadFile = function() {
            $scope.printFile($scope.superArray);
        };

        $scope.printFile = function(array) {
            var outText;
            var filename;
            outText = $scope.resultsToTextFile(array);
            filename = "savedFile.txt";
            $scope.savetextAsFile(outText, filename);
        };

        $scope.savetextAsFile = function(textToWrite, fileNameToSaveAs) {
            var textFileAsBlob = new Blob([textToWrite], {
                type: "text/plain"
            });
            var downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";

            if (URL != null) {
                /* Chrome */
                downloadLink.href = URL.createObjectURL(textFileAsBlob);
            }
            downloadLink.click();
        };

        $scope.resultsToTextFile = function(fileArray) {
            var output = "";

            for (var i = 0; i < fileArray.length; i++) {
                var file = fileArray[i];
                output += "[FILE_" + (i + 1) + "]\r\n";
                output += "FILENAME = " + file.fileName + "\r\n";
                output += "LLOC = " + file.lloc + "\r\n";
                output += "GLOBAL LLOC = " + file.globalLLOC + "\r\n\r\n";

                var classArray = fileArray[i].allMyClasses;
                for (var j = 0; j < classArray.length; j++) {
                    var cls = classArray[j];
                    output += "CLASSNAME = " + cls.className + "\r\n";
                    output += "METHODS = " + cls.allMyMethods.length + "\r\n\r\n";

                    var methodArray = classArray[j].allMyMethods;
                    for (var k = 0; k < methodArray.length; k++) {
                        var method = methodArray[k];
                        output += " " + method.methodName + " = " + method.lloc + "\r\n";
                    }
                    output += "\r\n";
                }
                output += "[CLASS]\r\n";
                output += "TOTAL CLASS LLOC = " + file.classTotalLLOC + "\r\n";
                output += "AVERAGE CLASS LLOC = " + file.classAvgLLOC + "\r\n";
                output += "STD_DEV CLASS LLOC = " + file.classStdDevLLOC + "\r\n";
                output += "[METHOD]\r\n";
                output += "TOTAL METHOD LLOC per FILE = " + file.classTotalLLOC + "\r\n";
                output += "AVERAGE METHOD LLOC per FILE = " + file.totalMethodLLOCavg + "\r\n";
                output += "STD_DEV = " + file.classStdDevLLOC + "\r\n";
                output += "\r\n---------\r\n\r\n";
            }

            /* ALTERNATE RESULTS SUMMARY
            output += "-------\r\n";
            output += "SUMMARY\r\n";
            output += "-------\r\n";
            output += "[CLASS]\r\n";
            output += " TOTAL Classes across ALL FILES = " + $scope.results.totalClassesAllFiles + "\r\n";
            output += " AVERAGE Classes per FILE = " + $scope.results.avgClassesPerFile + "\r\n";
            output += " STD DEVIATION of Classes per FILE = " + $scope.results.stdDevClassesPerFile + "\r\n";
            output += "[METHOD]\r\n";
            output += " TOTAL Methods across ALL FILES = " + $scope.results.totalMethodsAllFiles + "\r\n";
            output += " AVERAGE Methods per FILE = " + $scope.results.avgMethodsPerFile + "\r\n";
            output += " STD DEVIATION = " + $scope.results.stdDevMethodsPerFile + "\r\n";
            */
            return output;
        };

        /* TRIGGER */
        document.getElementById('files').addEventListener('change', $scope.fileLoader, false);
    });

})();