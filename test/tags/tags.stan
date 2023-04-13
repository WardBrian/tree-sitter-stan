functions {
//<- definition.module
  vector rhs(real t, vector y, real alpha) {
    //   ^ definition.function
    vector[1] yp = -alpha * y;
    return yp;
  }
  #include <more_functions.stan>
}
data {
//<- definition.module
  vector[4] x;
}
parameters {
//<- definition.module
  real e;
  real<lower=0> read_constrain_lb;
}
transformed parameters {
//<- definition.module
  real mu;
  mu = e() + e;
  //   ^ reference.call

  vector[num_elements(x)] result = x * 5.0;

  profile("shadow-1") {
    mu += profile_map;
  }

  for (i in 1 : 5) {
    mu += i;
    {
      int i;
      print(i);
      //<- reference.call
    }
  }
}
model {
//<- definition.module
  print("hello world");
}
