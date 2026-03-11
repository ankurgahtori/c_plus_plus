#include <iostream>
#include <string>
#include <utility>

using namespace std;

int main() {
    vector<pair<int,int>> v={{1,2},{3,4}};

    for(pair<int,int> &p : v){
        cout<<p.first<<" "<<p.second<<endl;
    }
    for(pair<int,int> p : v){
        cout<<p.first<<" "<<p.second<<endl;
    }
    
    int a=30;
    int &b =a;
    int *c =&a;

    a=40;
    cout<<a<<"---->"<<b<<"------>"<<*c<<endl;
    
    return 0;
}