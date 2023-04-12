functions {
// <- module
//        ^ punctuation.bracket
  vector rhs(real t, vector y, real alpha) {
  // <- type
  //     ^ function
  //        ^ punctuation.bracket
  //         ^ type
  //              ^ variable.parameter
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
}

data {
   vector[4] x;
}
parameters {
  real e;
  //   ^ variable
  real<lower=0> read_constrain_lb;
  //    ^ property
  //             ^ variable
}
transformed parameters {
  real mu;
  mu = e() + e;
  //   ^ function.call
  //         ^ variable

  vector[num_elements(x)] result = x * 5.0;

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
      //    ^ variable
    }
  }
}
model {
  print("hello world");
  //^ function.call
  //    ^ string
}
