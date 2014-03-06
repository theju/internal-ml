#Haraka Internal ML#

A [Haraka plugin](https://haraka.github.io/) that can be used to setup simple
internal mailing lists.

##Installation##

```shell
$ git clone https://github.com/theju/internal-ml
$ npm install -g haraka
```

##Configuration##

In the `internal-ml/config` directory, create a file called `lists.json`:

```json
{
    "list1": [
            "user1@domain.com",
            "user2@domain.com"
    ],
    "list2": [
            "user2@domain.com",
            "user3@domain.com"
    ]
}
```

##Run##

```shell
$ haraka -c internal-ml
```

When you send an email to `list1@domain.com` (`domain.com` being specified in
the `config/host_list`) from a `*@domain.com` address, an email is sent out to
the corresponding users (`user1@domain.com` and `user2@domain.com` in this case).

##License##

Please refer to the `LICENSE` file in the source for more details.
