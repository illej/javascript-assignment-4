(function() {
    // 1
    var app = angular.module('calculator', ['file-model']);
    // 2 	// 3	// 4
    app.controller("CalController", function($scope) {
        // 5							// 6
        $scope.numbers = [];
        // 7	// 8
        $scope.results = {};
        // 9	// 10
        $scope.status = null;
        // 11	// 12
        $scope.idleAlert = true;
        // 13	// 14
        $scope.firstAlert = null;
        // 15	// 16
        $scope.secondAlert = null;
        // 17	// 18
        $scope.loadFromStorageAlert = null;
        // 19				// 20
        // 21					// 22
        $scope.emptyStorageAlert = null;

        $scope.isFileChosen = function() {
            // 23		// 24	// 25
            if ($scope.fileX) {
                // 26	// 27
                return true;
                // 28
            } else {
                // 29
                return false;
            } // 30
        };

        $scope.alertStatus = function(status) {
            // 31		// 32	// 33
            switch (status) {
                // 34
                case null:
                    // 35
                    $scope.idleAlert = true;
                    // 36		// 37
                    $scope.firstAlert = false;
                    // 38		// 39
                    $scope.secondAlert = false;
                    // 40		// 41
                    break;
                    // 42
                case "First":
                    // 43
                    $scope.idleAlert = false;
                    // 44		// 45
                    $scope.firstAlert = true;
                    // 46		// 47
                    $scope.secondAlert = false;
                    // 48		// 49
                    $scope.loadFromStorageAlert = false;
                    // 50				// 51
                    $scope.emptyStorageAlert = false;
                    // 52				// 53
                    break;
                    // 54
                case "Second":
                    // 55
                    $scope.idleAlert = false;
                    // 56		// 57
                    $scope.firstAlert = false;
                    // 58		// 59
                    $scope.secondAlert = true;
                    // 60		// 61
                    $scope.loadFromStorageAlert = false;
                    // 62				// 63
                    $scope.emptyStorageAlert = false;
                    // 64				// 65
                    break;
                    // 66
                case "Finished":
                    // 67
                    $scope.idleAlert = true;
                    // 68		// 69
                    $scope.firstAlert = false;
                    // 70		// 71
                    $scope.secondAlert = false;
                    // 72		// 73
                    $scope.loadFromStorageAlert = false;
                    // 74				// 75
                    $scope.emptyStorageAlert = false;
                    // 76			// 77
                    break;
                    // 78
                case "loadStorage":
                    // 79
                    $scope.idleAlert = false;
                    // 80		// 81
                    $scope.secondAlert = false;
                    // 82		// 83
                    $scope.loadFromStorageAlert = true;
                    // 84				// 85
                    $scope.emptyStorageAlert = false;
                    // 86				// 87
                    break;
                    // 88
                case "emptyStorage":
                    // 89
                    $scope.loadFromStorageAlert = false;
                    // 90				// 91
                    $scope.emptyStorageAlert = true;
                    // 92				// 93
                    break;
                    // 94
            }
        };

        $scope.isStorage = function() {
            // 95		// 96	// 97
            if (localStorage.getItem("storedObject")) {
                // 98		// 99			
                return true;
                // 100
            } else {
                // 101
                return false;
            } // 102
        };

        $scope.calSum = function(numbers) {
            // 103	// 104 // 105
            var sum = 0;
            // 106 // 107
            for (var index = 0; index < numbers.length; index++) {
                // 108 // 109 // 110	// 111	// 112		// 113 // 114
                sum += numbers[index];
                // 115 // 116
            }
            return sum;
            // 117
        };

        $scope.calMean = function(numbers, sum) {
            // 118	// 119	// 120
            return sum / numbers.length;
            // 121	// 122		// 123
        };

        $scope.xMinusMean = function(numbers, mean) {
            // 124	 // 125	 // 126
            var array = [];
            // 127	// 128
            for (var i = 0; i < numbers.length; i++) {
                // 129 // 130 // 131 // 132 // 133 // 134 // 135
                array.push(numbers[i] - mean);
                // 136				// 137
            }
            console.log(array);
            // 138
            return array;
            // 139
        };

        $scope.calStdDeviation = function(sum, numbers) {
            // 140				// 141 // 142
            var stdDev = 0;
            // 143	// 144
            stdDev = Math.sqrt(sum / (numbers.length - 1));
            // 145 // 146	// 147	 // 148		// 149
            return stdDev;
            // 150
        };

        $scope.xTimesY = function(xNumbers, yNumbers) {
            // 151	// 152	// 153
            var XiYi = [];
            // 154	// 155
            for (var i = 0; i < xNumbers.length; i++) {
                // 156 // 157 // 158 // 159 // 160 // 161 // 162
                XiYi.push(xNumbers[i] * yNumbers[i]);
                // 163			// 164
            }
            console.log(XiYi);
            // 165
            return XiYi;
            // 167
        };

        $scope.calcSquareArray = function(numbers) {
            // 168			// 169 // 170
            var xSquared = [];
            // 171		// 172
            for (var i = 0; i < numbers.length; i++) {
                // 173 // 174 // 175 // 176	// 177		// 178 // 179
                xSquared.push(Math.pow(numbers[i], 2));
                // 180		// 181
            }
            return xSquared;
            // 182
        };

        $scope.beta1 = function(numbers, sum, meanX, meanY, sumXsq) {
            // 183	// 184 // 185
            var beta = 0;
            // 186	// 187
            beta = (sum - numbers.length * meanX * meanY) / (sumXsq - numbers.length * meanX * meanX);
            // 188 	  // 189	// 190	// 191	// 192	// 193	// 194	// 195		// 196	// 197
            return beta;
            // 198
        };

        $scope.beta0 = function(beta1, meanX, meanY) {
            // 199 // 200 // 201
            var beta = 0;
            // 202	// 203
            beta = (meanY - beta1 * meanX);
            // 204		// 205	// 206
            return beta;
            // 207
        };

        $scope.top = function(numbers, sumXY, sumX, sumY) {
            // 208	// 209	// 210
            var top;
            // 211
            top = (numbers.length * sumXY - sumX * sumY);
            // 212		// 213	// 214	// 215	// 216
            return top;
            // 217
        };

        $scope.bottom = function(numbers, sumXSquared, sumYSquared, sumX, sumY) {
            // 218		// 219 // 220
            var bottom;
            // 221
            bottom = Math.sqrt((numbers.length * sumXSquared - (sumX * sumX)) * (numbers.length * sumYSquared - (sumY * sumY)));
            // 222	// 223		// 224	// 225		// 226	// 227		// 228	// 229	// 230		// 231		// 232
            return bottom;
            // 233
        };

        $scope.divide = function(x, y) {
            // 234	// 235 // 236
            return x / y;
            // 237	// 238
        };

        $scope.calcSquare = function(num) {
            // 239		// 240	// 241
            return Math.pow(num, 2);
            // 242	// 243
        };

        $scope.calcYk = function() {
            // 244		// 245	// 246
            var Xk = $scope.estimate;
            // 247 // 248 // 249
            $scope.results.Yk = $scope.results.beta0 + $scope.results.beta1 * Xk;
            // 250	// 251 // 252	// 253 // 254 // 255 // 256 // 257	// 258
        };

        $scope.getData = function() {
            // 259	// 260	// 261
            if ($scope.status == null) {
                // 262	// 263	// 264
                $scope.readFile($scope.fileX);
                // 265			// 266
                $scope.status = "First";
                // 267		// 268
            } else if ($scope.status == "First") {
                // 269 // 270 // 271 // 272
                $scope.readFile($scope.fileX);
                // 273			// 274
                $scope.status = "Second";
                // 275		// 276
            } else if ($scope.status == "Second") {
                // 277 // 278 // 279 // 280
                $scope.status = "Finished";
                // 281		// 282
            }
            $scope.alertStatus($scope.status);
            // 283				// 284
        };

        $scope.readFile = function(file) {
            // 285	// 286	// 287
            var reader = new FileReader(file);
            // 288	// 289	// 290
            reader.readAsText(file);
            // 291

            reader.onload = function() {
                // 292		// 293 // 294
                var textInFile = reader.result;
                // 295		// 296	// 297
                var numbers = $scope.convertStringtoNumbers(textInFile);
                // 298	// 299	// 300
                $scope.$applyAsync($scope.numbers.push(numbers));
                // 301				// 302		// 303
                if ($scope.numbers.length === 2) {
                    // 304	// 305	// 306 // 307
                    $scope.calculate($scope.numbers[0], $scope.numbers[1]);
                    // 308			// 309					// 310			
                }
            };
        };

        $scope.calculate = function(xNumbers, yNumbers) {
            // 311		// 312	// 313
            var results = {};
            // 314	// 315
            results.numbers = [];
            // 316		// 317
            results.numbers.push(xNumbers);
            // 318		// 319
            results.numbers.push(yNumbers);
            // 320		// 321
            results.sumX = $scope.calSum(xNumbers);
            // 322		// 323 // 324
            results.sumY = $scope.calSum(yNumbers);
            // 325		// 326	// 327
            results.meanX = $scope.calMean(xNumbers, results.sumX);
            // 328		// 329	// 330				// 331
            results.meanY = $scope.calMean(yNumbers, results.sumY);
            // 332		// 333	// 334					// 335
            results.xMinusMeanArray = $scope.xMinusMean(xNumbers, results.meanX);
            // 336				// 337	// 338						// 339
            results.yMinusMeanArray = $scope.xMinusMean(yNumbers, results.meanY);
            // 340				// 341	// 342						// 343
            results.xMinusMeanSquaredArray = $scope.calcSquareArray(results.xMinusMeanArray);
            // 344						// 345	// 346					// 347
            results.yMinusMeanSquaredArray = $scope.calcSquareArray(results.yMinusMeanArray);
            // 348						// 349	// 350					// 351
            results.SumXMinusMeanSquared = $scope.calSum(results.xMinusMeanSquaredArray);
            // 352					// 353		// 354		// 355
            results.SumYMinusMeanSquared = $scope.calSum(results.yMinusMeanSquaredArray);
            // 356					// 357		// 358		// 359
            results.stdDeviationX = $scope.calStdDeviation(results.SumXMinusMeanSquared, xNumbers);
            // 360			// 361		// 362				// 363			 
            results.stdDeviationY = $scope.calStdDeviation(results.SumYMinusMeanSquared, yNumbers);
            // 364			// 365		// 367				// 368	
            results.xTimesY = $scope.xTimesY(xNumbers, yNumbers);
            // 369		// 370	// 371
            results.sumXY = $scope.calSum(results.xTimesY);
            // 372		// 373	// 374		// 375
            results.xSquared = $scope.calcSquareArray(xNumbers);
            // 376		// 377	// 378
            results.sumXSquared = $scope.calSum(results.xSquared);
            // 379			// 380	// 381		// 382
            results.beta1 = $scope.beta1(xNumbers, results.sumXY, results.meanX, results.meanY, results.sumXSquared);
            // 383		// 384	// 385				// 386			// 387			// 388			// 389
            results.beta0 = $scope.beta0(results.beta1, results.meanX, results.meanY);
            // 390		// 391	// 392		// 393			// 394		// 395

            results.ySquared = $scope.calcSquareArray(yNumbers);
            // 396		// 397		// 398
            results.sumYSquared = $scope.calSum(results.ySquared);
            // 399			// 400		// 401		// 402
            results.top = $scope.top(xNumbers, results.sumXY, results.sumX, results.sumY);
            // 403	// 404	// 405				// 406			// 407			// 408
            results.bottom = $scope.bottom(xNumbers, results.sumXSquared, results.sumYSquared, results.sumX, results.sumY);
            // 409		// 410	// 411					// 412				// 413				// 414			// 415
            results.topDividedByBottom = $scope.divide(results.top, results.bottom);
            // 416				// 417		// 418		// 419			// 420
            results.r = results.topDividedByBottom;
            // 421	// 422	// 423
            results.rSquared = $scope.calcSquare(results.r);
            // 424		// 425		// 426			// 427
            results.Yk = $scope.calcYk();
            // 428	// 429	// 430
            $scope.sendToStorage(results);
            // 431
            $scope.results = results;
            // 432		// 433
        };

        $scope.convertStringtoNumbers = function(text) {
            // 434			// 435		// 436
            return text.split("\n").map(Number);
            // 437	// 438		// 439
        };

        $scope.sendToStorage = function(object) {
            // 440		// 441 // 442
            var stringObject = JSON.stringify(object);
            // 443	// 444		// 445
            localStorage.setItem("storedObject", stringObject);
            // 446
        };

        $scope.loadStorage = function() {
            // 447			// 448	// 449
            var storedString = localStorage.getItem("storedObject");
            // 450		// 451			// 452
            var convertedObject = JSON.parse(storedString);
            // 453			// 454	// 455
            $scope.results = convertedObject;
            // 456		// 457
            $scope.alertStatus("loadStorage");
            // 458
        };

        $scope.clearStorage = function() {
            // 459	// 460	// 461
            localStorage.removeItem("storedObject");
            // 462
            $scope.alertStatus("emptyStorage");
            // 463
        };
    });
})();