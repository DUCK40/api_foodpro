let dimensionBlock = function() {};

dimensionBlock.prototype.chooseBox = async (
  dimX,
  dimY,
  dimZ,
  amountGoods,
  weight,
  sendMethod
) => {
  let res = { TEST: "0" };
  // box S = 18x27x10 w <= 5
  const boxSDimX = 17;
  const boxSDimY = 26;
  const boxSDimZ = 9;
  const boxSW = 5;
  const boxSWCh = 3;
  const boxSWFr = 1;
  // box A = 23x30x20 w <= 10
  const boxADimX = 22;
  const boxADimY = 29;
  const boxADimZ = 19;
  const boxAW = 10;
  const boxAWCh = 6;
  const boxAWFr = 4;
  // box B1 = 27x39x20 w <= 20
  const boxB1DimX = 26;
  const boxB1DimY = 38;
  const boxB1DimZ = 19;
  const boxB1W = 20;
  const boxB1WCh = 15;
  const boxB1WFr = 11;
  // box B2 = 37x51x17 w <= 25
  const boxB2DimX = 36;
  const boxB2DimY = 50;
  const boxB2DimZ = 16;
  const boxB2W = 25;
  const boxB2WCh = 19;
  const boxB2WFr = 13;
  // box C = 42x42x23 w <= 30
  const boxCDimX = 41;
  const boxCDimY = 41;
  const boxCDimZ = 22;
  const boxCW = 30;
  const boxCWCh = 24;
  const boxCWFr = 15;

  var exBox;
  var Xd;
  var arrB = [];
  //   chS()
  exBox = chS(amountGoods, 0);
  function chS(amount, round) {
    //case BoxS
    // console.log("chS:"+round)
    var retS = 0;
    var xS = parseInt(boxSDimX / dimX);
    var yS = parseInt(boxSDimY / dimY);
    var zS = parseInt(boxSDimZ / dimZ);
    if (xS > 0 && yS > 0 && zS > 0) {
      retS = parseInt(xS) * parseInt(yS) * parseInt(zS);
    } else {
      retS = 0;
    }
    if(sendMethod=='N'){
      if (retS > 0) {
        if (Math.ceil(amount / retS) <= 1) {
          if (amount * weight <= boxSW) {
            //return retS
            var arrS = []
            arrS.push({ SIZE: "S", TOTAL: Math.ceil(amount / retS) })
            return { DATA: arrS };
          } else {
            return chA(amount, round);
          }
        } else {
          return chA(amount, round);
        }
      } else {
        return chA(amount, round);
      }
    }else if(sendMethod=='CH'){
      if (retS > 0) {
        if (Math.ceil(amount / retS) <= 1) {
          if (amount * weight <= boxSWCh) {
            //return retS
            var arrS = []
            arrS.push({ SIZE: "S", TOTAL: Math.ceil(amount / retS) })
            return { DATA: arrS };
          } else {
            return chA(amount, round);
          }
        } else {
          return chA(amount, round);
        }
      } else {
        return chA(amount, round);
      }
    }else if(sendMethod=='FR'){
      if (retS > 0) {
        if (Math.ceil(amount / retS) <= 1) {
          if (amount * weight <= boxSWFr) {
            //return retS
            var arrS = []
            arrS.push({ SIZE: "S", TOTAL: Math.ceil(amount / retS) })
            return { DATA: arrS };
          } else {
            return chA(amount, round);
          }
        } else {
          return chA(amount, round);
        }
      } else {
        return chA(amount, round);
      }
    }
  }

  function chA(amount, round) {
    //case BoxA
    // console.log("chA:"+round)
    var retA = 0;
    var xA = parseInt(boxADimX / dimX);
    var yA = parseInt(boxADimY / dimY);
    var zA = parseInt(boxADimZ / dimZ);
    if (xA > 0 && yA > 0 && zA > 0) {
      retA = parseInt(xA) * parseInt(yA) * parseInt(zA);
    } else {
      retA = 0;
    }
    if(sendMethod=='N'){
      if (retA > 0) {
        if (Math.ceil(amount / retA) <= 1) {
          if (amount * weight <= boxAW) {
            //return retA
            var arrA = []
            arrA.push({ SIZE: "A", TOTAL: Math.ceil(amount / retA) })
            return { DATA: arrA };
          } else {
            return chB1(amount, round);
          }
        } else {
          return chB1(amount, round);
        }
      } else {
        return chB1(amount, round);
      }
    }else if(sendMethod=='CH'){
      if (retA > 0) {
        if (Math.ceil(amount / retA) <= 1) {
          if (amount * weight <= boxAWCh) {
            //return retA
            var arrA = []
            arrA.push({ SIZE: "A", TOTAL: Math.ceil(amount / retA) })
            return { DATA: arrA };
          } else {
            return chB1(amount, round);
          }
        } else {
          return chB1(amount, round);
        }
      } else {
        return chB1(amount, round);
      }
    }else if(sendMethod=='FR'){
      if (retA > 0) {
        if (Math.ceil(amount / retA) <= 1) {
          if (amount * weight <= boxAWFr) {
            //return retA
            var arrA = []
            arrA.push({ SIZE: "A", TOTAL: Math.ceil(amount / retA) })
            return { DATA: arrA };
          } else {
            return chB1(amount, round);
          }
        } else {
          return chB1(amount, round);
        }
      } else {
        return chB1(amount, round);
      }
    }
  }

  function chB1(amount, round) {
    //case BoxB1
    // console.log("chB1:"+round)
    var retB1 = 0;
    var xB1 = parseInt(boxB1DimX / dimX);
    var yB1 = parseInt(boxB1DimY / dimY);
    var zB1 = parseInt(boxB1DimZ / dimZ);
    if (xB1 > 0 && yB1 > 0 && zB1 > 0) {
      retB1 = parseInt(xB1) * parseInt(yB1) * parseInt(zB1);
    } else {
      retB1 = 0;
    }
    if(sendMethod=='N'){
      if (retB1 > 0) {
        if (Math.ceil(amount / retB1) <= 1) {
          if (amount * weight <= boxB1W) {
            //return retB1
            var arrB1 = []
            arrB1.push({ SIZE: "B1", TOTAL: Math.ceil(amount / retB1) })
            return { DATA: arrB1 };
          } else {
            return chB2(amount, round);
          }
        } else {
          return chB2(amount, round);
        }
      } else {
        return chB2(amount, round);
      }
    }else if(sendMethod=='CH'){
      if (retB1 > 0) {
        if (Math.ceil(amount / retB1) <= 1) {
          if (amount * weight <= boxB1WCh) {
            //return retB1
            var arrB1 = []
            arrB1.push({ SIZE: "B1", TOTAL: Math.ceil(amount / retB1) })
            return { DATA: arrB1 };
          } else {
            return chB2(amount, round);
          }
        } else {
          return chB2(amount, round);
        }
      } else {
        return chB2(amount, round);
      }
    }else if(sendMethod=='FR'){
      if (retB1 > 0) {
        if (Math.ceil(amount / retB1) <= 1) {
          if (amount * weight <= boxB1WFr) {
            //return retB1
            var arrB1 = []
            arrB1.push({ SIZE: "B1", TOTAL: Math.ceil(amount / retB1) })
            return { DATA: arrB1 };
          } else {
            return chB2(amount, round);
          }
        } else {
          return chB2(amount, round);
        }
      } else {
        return chB2(amount, round);
      }
    }
  }

  function chB2(amount, round) {
    //case BoxB2
    // console.log("chB2:"+round)
    var retB2 = 0;
    var xB2 = parseInt(boxB2DimX / dimX);
    var yB2 = parseInt(boxB2DimY / dimY);
    var zB2 = parseInt(boxB2DimZ / dimZ);
    if (xB2 > 0 && yB2 > 0 && zB2 > 0) {
      retB2 = parseInt(xB2) * parseInt(yB2) * parseInt(zB2);
    } else {
      retB2 = 0;
    }
    if(sendMethod=='N'){
      if (retB2 > 0) {
        if (Math.ceil(amount / retB2) <= 1) {
          if (amount * weight <= boxB2W) {
            //return retB2
            var arrB2 = []
            arrB2.push({ SIZE: "B2", TOTAL: Math.ceil(amount / retB2) })
            return { DATA: arrB2 };
          } else {
            return chC(amount, round);
          }
        } else {
          return chC(amount, round);
        }
      } else {
        return chC(amount, round);
      }
    }else if(sendMethod=='CH'){
      if (retB2 > 0) {
        if (Math.ceil(amount / retB2) <= 1) {
          if (amount * weight <= boxB2WCh) {
            //return retB2
            var arrB2 = []
            arrB2.push({ SIZE: "B2", TOTAL: Math.ceil(amount / retB2) })
            return { DATA: arrB2 };
          } else {
            return chC(amount, round);
          }
        } else {
          return chC(amount, round);
        }
      } else {
        return chC(amount, round);
      }
    }else if(sendMethod=='FR'){
      if (retB2 > 0) {
        if (Math.ceil(amount / retB2) <= 1) {
          if (amount * weight <= boxB2WFr) {
            //return retB2
            var arrB2 = []
            arrB2.push({ SIZE: "B2", TOTAL: Math.ceil(amount / retB2) })
            return { DATA: arrB2 };
          } else {
            return chC(amount, round);
          }
        } else {
          return chC(amount, round);
        }
      } else {
        return chC(amount, round);
      }
    }
  }

  function chC(amount, round) {
    //case BoxC
    var retC = 0;
    var xC = parseInt(boxCDimX / dimX);
    var yC = parseInt(boxCDimY / dimY);
    var zC = parseInt(boxCDimZ / dimZ);
    if (xC > 0 && yC > 0 && zC > 0) {
      retC = parseInt(xC) * parseInt(yC) * parseInt(zC);
    } else {
      retC = 0;
    }

    if(sendMethod=='N'){
      if (retC > 0) {
        var minBox = 0;
        var sum = 0;
        if (parseInt(amount / retC) == 0) {
          minBox = 1;
        } else {
          minBox = parseInt(amount / retC);
        }
        var maxRetC = retC * minBox;
        var y = loop(0, maxRetC, boxCW * minBox);
        if (amount > maxRetC) {
          sum = amount - y;
        } else {
          if (amount >= y) {
            sum = amount - y;
          } else {
            sum = 0;
          }
        }
        if (round == 0) {
          arrB.push({ SIZE: "C", TOTAL: minBox, EX: sum });
        }else{
          arrB.push({ SIZE: "C", TOTAL: minBox, EX: sum });
        }
        if (sum > 0) {
          Xd = chS(sum,1);
          if(Xd.DATA[0].SIZE == "S" || Xd.DATA[0].SIZE == "A"|| Xd.DATA[0].SIZE == "B1"|| Xd.DATA[0].SIZE == "B2"){
            arrB.push(Xd.DATA[0]);
          }
        }
        var retSum = { DATA: arrB };
        return retSum;
      } else {
        var retFail = [{SIZE: "-", TOTAL: 0 }];
        return { DATA:retFail};
      }
    }else if(sendMethod=='CH'){
      if (retC > 0) {
        var minBox = 0;
        var sum = 0;
        if (parseInt(amount / retC) == 0) {
          minBox = 1;
        } else {
          minBox = parseInt(amount / retC);
        }
        var maxRetC = retC * minBox;
        var y = loop(0, maxRetC, boxCWCh * minBox);
        if (amount > maxRetC) {
          sum = amount - y;
        } else {
          if (amount >= y) {
            sum = amount - y;
          } else {
            sum = 0;
          }
        }
        if (round == 0) {
          arrB.push({ SIZE: "C", TOTAL: minBox, EX: sum });
        }else{
          arrB.push({ SIZE: "C", TOTAL: minBox, EX: sum });
        }
        if (sum > 0) {
          Xd = chS(sum,1);
          if(Xd.DATA[0].SIZE == "S" || Xd.DATA[0].SIZE == "A"|| Xd.DATA[0].SIZE == "B1"|| Xd.DATA[0].SIZE == "B2"){
            arrB.push(Xd.DATA[0]);
          }
        }
        var retSum = { DATA: arrB };
        return retSum;
      } else {
        var retFail = [{SIZE: "-", TOTAL: 0 }];
        return { DATA:retFail};
      }
    }else if(sendMethod=='FR'){
      if (retC > 0) {
        var minBox = 0;
        var sum = 0;
        if (parseInt(amount / retC) == 0) {
          minBox = 1;
        } else {
          minBox = parseInt(amount / retC);
        }
        var maxRetC = retC * minBox;
        var y = loop(0, maxRetC, boxCWFr * minBox);
        if (amount > maxRetC) {
          sum = amount - y;
        } else {
          if (amount >= y) {
            sum = amount - y;
          } else {
            sum = 0;
          }
        }
        if (round == 0) {
          arrB.push({ SIZE: "C", TOTAL: minBox, EX: sum });
        }else{
          arrB.push({ SIZE: "C", TOTAL: minBox, EX: sum });
        }
        if (sum > 0) {
          Xd = chS(sum,1);
          if(Xd.DATA[0].SIZE == "S" || Xd.DATA[0].SIZE == "A"|| Xd.DATA[0].SIZE == "B1"|| Xd.DATA[0].SIZE == "B2"){
            arrB.push(Xd.DATA[0]);
          }
        }
        var retSum = { DATA: arrB };
        return retSum;
      } else {
        var retFail = [{SIZE: "-", TOTAL: 0 }];
        return { DATA:retFail};
      }
    }
  }

  function loop(initV, preV, boxV) {
    var y = 0;
    for (var x = initV; x < preV; x++) {
      if (x * weight < boxV) {
        y++;
      } else {
        x = x + preV;
      }
    }
    return y;
  }

  // exBox= Math.max(retS,retA,retB1,retB2,retC)

  return exBox;
};

module.exports = new dimensionBlock();
