using System.Collections.Generic;
using System.IO;
using System.Threading;
using EasyAR;
using UnityEngine;
using UnityEngine.Video;

public class EasyARCloudHandler : CloudRecognizerBehaviour
{
    private List<string> uids = new List<string>();
    private ImageTrackerBaseBehaviour trackerBehaviour;
    private string persistentDataPath;
    public bool SaveNewTarget;
    public GameObject videoPlayerPrefab;

    private void Awake()
    {
        if (Server.Length <= 0 || Key.Length <= 0 || Secret.Length <= 0)
            Debug.LogError("Cloud is not set up! Set up 'CloudRecognizer' in the scene or setup values in the scripts.");

        FindObjectOfType<EasyARBehaviour>().Initialize();
        persistentDataPath = Application.persistentDataPath;
        CloudUpdate += OnCloudUpdate;
        WorkStart += OnWorkStart;
        if (ARBuilder.Instance.ImageTrackerBehaviours.Count > 0)
            trackerBehaviour = ARBuilder.Instance.ImageTrackerBehaviours[0];
    }

    private void OnWorkStart(DeviceUserAbstractBehaviour cloud, DeviceAbstractBehaviour camera)
    {
        Debug.Log("Cloud recognition has started!");
    }

    private void OnCloudUpdate(CloudRecognizerBaseBehaviour cloud, Status status, List<ImageTarget> targets)
    {
        if (status != Status.Success && status != Status.Fail)
        {
            Debug.LogWarning("Cloud: " + status);
        }
        if (!trackerBehaviour)
            return;
        foreach (var imageTarget in targets)
        {
            if (uids.Contains(imageTarget.Uid))
                continue;

            Debug.Log("New Cloud Target: " + imageTarget.Uid + "(" + imageTarget.Name + ")");
            uids.Add(imageTarget.Uid);

            var target = new GameObject();
            target.transform.name = "VideoPlayerParent";
            var targetBehaviour = target.AddComponent<VideoImageTargetBehaviour>();
            if (!targetBehaviour.SetupWithTarget(imageTarget))
                continue;
            targetBehaviour.Bind(trackerBehaviour);

            var videoPlayer = Instantiate(videoPlayerPrefab);
            videoPlayer.transform.parent = target.transform;
            videoPlayer.transform.localPosition = Vector3.zero;
            videoPlayer.transform.localScale = new Vector3(targetBehaviour.Size.x / Mathf.Max(targetBehaviour.Size.x, targetBehaviour.Size.y), 1f , 1f);
            if (SaveNewTarget)
            {
                var thread = new Thread(SaveRunner) { Priority = System.Threading.ThreadPriority.BelowNormal };
                thread.Start(imageTarget);
            }
        }
    }

    private void SaveRunner(object args)
    {
        var imageTarget = args as ImageTarget;
        var image = imageTarget.Images[0];

        byte[] fileHeader = new byte[14] { (byte)'B', (byte)'M', 0, 0, 0, 0, 0, 0, 0, 0, 54, 4, 0, 0 };
        byte[] infoHeader = new byte[40] { 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
        byte[] pallate = new byte[1024];
        byte[] bmpPad = new byte[3] { 0, 0, 0 };

        int fileSize = 54 + 1024 + image.Width * image.Height;
        fileHeader[2] = (byte)(fileSize);
        fileHeader[3] = (byte)(fileSize >> 8);
        fileHeader[4] = (byte)(fileSize >> 16);
        fileHeader[5] = (byte)(fileSize >> 24);

        infoHeader[4] = (byte)(image.Width);
        infoHeader[5] = (byte)(image.Width >> 8);
        infoHeader[6] = (byte)(image.Width >> 16);
        infoHeader[7] = (byte)(image.Width >> 24);
        infoHeader[8] = (byte)(image.Height);
        infoHeader[9] = (byte)(image.Height >> 8);
        infoHeader[10] = (byte)(image.Height >> 16);
        infoHeader[11] = (byte)(image.Height >> 24);
        for (int i = 0; i < 256; i++)
        {
            pallate[4 * i] = (byte)i;
            pallate[4 * i + 1] = (byte)i;
            pallate[4 * i + 2] = (byte)i;
            pallate[4 * i + 3] = 0;
        }

        FileStream fs = File.Create(Path.Combine(persistentDataPath, imageTarget.Uid + ".bmp"));
        BinaryWriter bw = new BinaryWriter(fs);

        bw.Write(fileHeader);
        bw.Write(infoHeader);
        bw.Write(pallate);

        for (int i = 0; i < image.Height; i++)
        {
            bw.Write(image.Pixels, image.Width * (image.Height - i - 1), image.Width);
            if (image.Width % 4 > 0)
            {
                bw.Write(bmpPad, 0, 4 - image.Width % 4);
            }
        }

        bw.Close();
        fs.Close();

        string json = ""
                      + @"{"
                      + @"  ""images"": [{"
                      + @"    ""image"" : " + @"""" + imageTarget.Uid + ".bmp" + @"""" + ","
                      + @"    ""name"" : " + @"""" + imageTarget.Name + @"""" + ","
                      + @"    ""size"" : " + "[" + imageTarget.Size.x + ", " + imageTarget.Size.y + "]" + ","
                      + @"    ""uid"" : " + @"""" + imageTarget.Uid + @"""" + ","
                      + @"    ""meta"" : " + @"""" + imageTarget.MetaData + @"""" + "  }]"
                      + @"}";
        File.WriteAllText(Path.Combine(persistentDataPath, imageTarget.Uid + ".json"), json);
        Debug.Log("saved: " + imageTarget.Uid + " -> " + persistentDataPath);
    }
}
