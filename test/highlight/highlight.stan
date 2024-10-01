functions {
// <- module
//        ^ punctuation.bracket
  vector rhs(real t, vector y, data real alpha) {
  // <- type
  //     ^ function
  //        ^ punctuation.bracket
  //         ^ type
  //              ^ variable.parameter
  //                            ^ type
    vector[1] yp = -alpha * y;
  //^ type
  //       ^ number
  //          ^ variable
  //             ^ operator
  //                 ^ variable.parameter
    return yp;
  //^ keyword.control
  }
  #include <more_functions.stan>
  // <- keyword
  //         ^ string.special

  void foo(tuple(int, real) x) {
  //        ^ type
  }
}

data {
// <- module
   vector[4] x;
     //      ^ variable
   tuple(array[3] real, int) tup;
   // ^ type
   //     ^ type
    //             ^ type
    //                   ^ type
}
parameters {
// <- module

  real e;
  //   ^ variable
  real<lower=0> read_constrain_lb;
  //    ^ property
  //             ^ variable
}
transformed parameters {
// <- module

  real mu;
  mu = e() + e;
  //   ^ function.call
  //         ^ variable

  vector[num_elements(x)] result = x * 5.0;
  //      ^ function.call

  profile("shadow-1") {
    mu += profile_map;
  }

  for (i in 1:5) {
//^ keyword.control
  //   ^ variable.parameter
    mu += i;
  //^ variable
  //   ^ operator
  //      ^ variable.parameter
    {
      int i;
      print(i);
      //<- function.call
      //    ^ variable
    }
  }
}
model {
// <- module
  print("hello world");
  //^ function.call
  //    ^ string
  e ~ normal(0,1);
  //  ^ function.call
}
