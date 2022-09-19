# Linux Installation and Configuration

The following is a recommended way to configure Linux and install HarperDB. These instructions should work reasonably well for any public cloud or on-premises Linux instance.

---

These instructions assume that the following has already been completed:

1. Linux is installed
2. Basic networking is configured
3. A non-root user account dedicated to HarperDB with sudo privileges exists
4. An additional volume for storing HarperDB files is attached to the Linux instance
5. Traffic to ports 22 (SSH), 9925 (HarperDB HTTP or HTTPS), and 9926 (HarperDB Custom Functions) is permitted
6. For this example, we will use an AWS Ubuntu Server 18.04 LTS m5.large EC2 Instance with an additional General Purpose SSD EBS volume and the default “ubuntu” user account.

---

### (Optional) LVM Configuration
Logical Volume Manager (LVM) can be used to stripe multiple disks together to form a single logical volume. If striping disks together is not a requirement, skip these steps.

Find disk that already has a partition

```bash
used_disk=$(lsblk -P -I 259 | grep "nvme.n1.*part" | grep -o "nvme.n1")
```

Create array of free disks

```bash
declare -a free_disks
mapfile -t free_disks < <(lsblk -P -I 259 | grep "nvme.n1.*disk" | grep -o "nvme.n1" | grep -v "$used_disk")
```

Get quantity of free disks

```bash
free_disks_qty=${#free_disks[@]}
```

Construct pvcreate command

```bash
cmd_string=""
for i in "${free_disks[@]}"
do
cmd_string="$cmd_string /dev/$i"
done
```

Initialize disks for use by LVM

```bash
pvcreate_cmd="pvcreate $cmd_string"
$pvcreate_cmd
```

Create volume group

```bash
vgcreate_cmd="vgcreate hdb_vg $cmd_string"
$vgcreate_cmd
```

Create logical volume

```bash
lvcreate -n hdb_lv -i $free_disks_qty -l 100%FREE hdb_vg
```

Configure Data Volume

Run `lsblk` and note the device name of the additional volume

```bash
lsblk
```

Create an ext4 filesystem on the volume (The below commands assume the device name is nvme1n1. If you used LVM to create logical volume, replace /dev/nvme1n1 with /dev/hdb_vg/hdb_lv)

```bash
sudo mkfs.ext4 -L hdb_data /dev/nvme1n1
```

Mount the file system and set the correct permissions for the directory

```bash
mkdir /home/ubuntu/hdb
sudo mount -t ext4 /dev/nvme1n1 /home/ubuntu/hdb
sudo chown -R ubuntu:ubuntu /home/ubuntu/hdb
sudo chmod 775 /home/ubuntu/hdb
```

Create a fstab entry to mount the filesystem on boot

```bash
echo "LABEL=hdb_data /home/ubuntu/hdb ext4 defaults,noatime 0 1" | sudo tee -a /etc/fstab
```

Configure Linux and Install Prerequisites
If a swap file or partition does not already exist, create and enable a 2GB swap file

```bash
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo "/swapfile swap swap defaults 0 0" | sudo tee -a /etc/fstab
```

Increase the open file limits for the ubuntu user

```bash
echo "ubuntu soft nofile 500000" | sudo tee -a /etc/security/limits.conf
echo "ubuntu hard nofile 1000000" | sudo tee -a /etc/security/limits.conf
```

Verify Python v3.6, v3.7, v3.8, or v3.9 is installed.

```bash
python3 --version
```

Install build-essential

```bash
sudo apt-get update && sudo apt-get install -y build-essential
```

Install Node Version Manager (nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

Load nvm (or logout and then login)

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

Install Node.js using nvm ([read more about specific Node version requirements here](https://harperdb.io/docs/install-harperdb/node-version/))

```bash
nvm install 14.19.1
```

Install and Start HarperDB
Install HarperDB

```bash
npm install -g harperdb
harperdb install --TC_AGREEMENT "yes" --HDB_ROOT "/home/ubuntu/hdb" --SERVER_PORT "9925" --HDB_ADMIN_USERNAME "HDB_ADMIN" --HDB_ADMIN_PASSWORD "abc123!"
```

HarperDB will automatically start after installation. If you wish HarperDB to start when the OS boots, you can add a crontab entry

```bash
(crontab -l 2>/dev/null; echo "@reboot PATH=\"/home/ubuntu/.nvm/versions/node/v14.91.1/bin:$PATH\" && harperdb run") | crontab -
```

For more information visit the [HarperDB Command Line Interface guide](https://harperdb.io/docs/administration/harperdb-cli/).
