#include <iostream>

#include "OnlineSession.h"

using namespace std;

int main()
{
    cout << "Welcome to ONEX." << endl;

    OnlineSession *session = new OnlineSession();
    return session->run(cin);
}
