functions {
  vector rhs(real t, vector y, real alpha) {
    vector[1] yp = -alpha * y;
    return yp;
  }

  #include "more_functions.stan"
}
data {
  vector[4] x;
}
parameters {
  real e;
  real<lower=0> read_constrain_lb;
}
transformed parameters {
  real mu, sigma=1.3;
  mu = e() + e;

  vector[num_elements(x)] result = x * 5.0;

  profile("shadow-1") {
    mu += e;
  }

  for (i in 1 : 5) {
    mu += i;
    {
      int i;
      print(i);
    }
  }
}
model {
  print("hello world");
}
