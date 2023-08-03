import { create } from 'ipfs-http-client';

/* configure Infura auth settings */
const projectId = "2MN5pgT2konhzACcrEY8a7VW3WA"
const projectSecret = "0cc2b8f5f2f125ae312be098f689bb26"
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

