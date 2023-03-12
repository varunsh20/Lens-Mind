import { create } from 'ipfs-http-client';

/* configure Infura auth settings */
const projectId = "<your projectID>"
const projectSecret = "<your projectSecret>"
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

    const client = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
        }
      });

export const uploadIpfs = async (data) => {
        const result = await client.add(data);
        return result.path;
      };

